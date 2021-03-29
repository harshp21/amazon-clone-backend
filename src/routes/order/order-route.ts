// importing
import express, { Request, Response } from 'express';
import { IOrder, Order } from '../../models/order/order';
import { authenticate } from '../../service/authentication-service/authentication-service';

// router config
const router = express.Router();

router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const orders: Array<IOrder> = await Order.find({ 'user.userId': userId });
        res.json({
            message: 'orders successfully fetched',
            orders
        })
    } catch (err) {
        res.status(400).json({
            message: 'Failed to fetch orders'
        })
    }
})

export default router