// importing
import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { Cart, ICart } from '../../models/cart/cart';
import { authenticate } from '../../service/authentication-service/authentication-service';

// router config
const router: Router = express.Router();

// add to cart functionality
router.post('/add', authenticate, async (req: Request, res: Response) => {
    try {

        const { product, userId } = req.body;

        //check cart is available
        const cart = await Cart.findOne({ userId });
        const totalAmount = product.pricing.productPrice;
        let cartDetails = {};

        // add the products to cart
        if (cart) {
            cartDetails = await Cart.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(cart._id)
            }, {
                $push: {
                    cartProducts: {
                        productId: product._id,
                        productName: product.productName,
                        quantity: 1,
                        pricing: product.pricing,
                    }
                }, $inc: {
                    totalCartAmount: totalAmount
                }
            }, { new: true });
        } else {
            // create a cart and add details to cart
            const cart = new Cart({
                cartProducts: [{
                    productId: product._id,
                    productName: product.productName,
                    pricing: product.pricing,
                    quantity: 1,
                }],
                totalCartAmount: totalAmount,
                userId: userId,
            });

            cartDetails = await cart.save();
        }
        res.json({
            message: 'Product added to cart',
            cart: cartDetails
        });
    } catch (err) {
        res.status(401).json({
            message: 'Product failed to add to cart',
        });
    }
})


// remove from cart functionality
router.put('/remove', authenticate, async (req: Request, res: Response) => {
    try {
        const { product, quantity, userId } = req.body;

        // check cart exisits
        const cart = await Cart.findOne({ userId });
        let cartDetails = {};

        //remove from cart
        if (cart) {
            cartDetails = await Cart.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(cart._id) }, { $pull: { cartProducts: { productId: product._id } }, $inc: { totalCartAmount: (-1 * product.pricing.productPrice * quantity) } }, { new: true });
        }
        res.json({
            message: 'Product removed to cart',
            cart: cartDetails
        });
    } catch (err) {
        res.status(400).json({
            message: 'Unable to remove products to cart',
        })
    }
})

router.put('/update', authenticate, async (req: Request, res: Response) => {
    try {
        const { product, quantity, userId, isGift } = req.body;

        // update the cart
        const updatedCartProduct: ICart = await Cart.findOneAndUpdate(
            { userId, 'cartProducts.productId': product._id },
            {
                $set: {
                    'cartProducts.$.quantity': quantity,
                    'cartProducts.$.isGift': isGift,
                    'cartProducts.$.pricing.productPrice': product.pricing.productPrice * quantity,
                },
            }, { new: true });

        const updatedCart = await Cart.findOneAndUpdate(
            { _id: updatedCartProduct._id },
            {
                $set: {
                    totalCartAmount: updatedCartProduct.cartProducts.reduce((acc, cartProduct) => acc + cartProduct.pricing.productPrice, 0)
                }
            }, { new: true })

        if (updatedCart) {
            res.json({
                message: 'Cart Product Updated',
                cart: updatedCart
            })
        }
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update cart',
        })
    }
})

router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ userId, status: 'active' });
        res.json({
            message: 'Cart items successfully fetched',
            cart
        })
    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Failed to fetch cart items',
        })
    }
})

export default router;