// importing
import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import ShortUniqueId from 'short-unique-id';
import { authenticate } from '../../service/authentication-service/authentication-service';
import { Order } from '../../models/order/order';
import { Cart } from '../../models/cart/cart';

// router config
const router = express.Router();

router.post('/orders', authenticate, async (req: Request, res: Response) => {
    try {
        const { totalAmount } = req.body;

        // create instamce of razorpay
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        // create instance of short unique id
        const uid = new ShortUniqueId();

        // creating options for order
        const options = {
            amount: parseInt(totalAmount) * 100,
            currency: 'INR',
            receipt: `receipt_order_${uid()}`,
        };

        // create a order
        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json({
            message: 'Successfully created an order',
            order
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Amount exceeds maximum amount allowed (i.e: 20,000 rupees)'
        });
    }
});

router.post('/verification', authenticate, async (req: Request, res: Response) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            paymentData,
            userId,
            username,
        } = req.body;

        // secret key
        const SECRET = process.env.RAZORPAY_SECRET;

        // Creating our own digest
        const shasum = crypto.createHmac("sha256", SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        const isTransactionValid = digest === razorpaySignature;

        // save the order and payment details in the db
        const order = new Order({
            user: {
                userId,
                username,
            },
            orderId: razorpayOrderId,
            payment: {
                paymentId: razorpayPaymentId,
            },
            products: paymentData.products.map((product) => {
                return {
                    productId: product._id,
                    quantity: product.quantity,
                    productName: product.productName,
                    isGift: product.isGift
                }
            }),
            shipping: {
                customer: username,
                address: `${paymentData.shippingDetails.apartment},${paymentData.shippingDetails.area}, ${paymentData.shippingDetails.landmark}`,
                city: `${paymentData.shippingDetails.city} `,
                state: `${paymentData.shippingDetails.state}`,
                country: ` ${paymentData.shippingDetails.country}-${paymentData.shippingDetails.pinCode}`,
            },
            totalAmount: paymentData.totalAmount,
            orderTimestamp: new Date(),
            status: isTransactionValid ? 'Success' : 'Failure',
        });

        const result = await order.save();

        // clear the cart after successfull booking
        await Cart.updateOne({ userId }, { $set: { cartProducts: [], totalCartAmount: 0 } });


        // comparing our digest with the actual signature
        if (!isTransactionValid)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // send response msg
        res.json({
            msg: "Booking successfully done",
            result
        });

    } catch (error) {
        res.status(500).send(error);
    }
})

export default router;