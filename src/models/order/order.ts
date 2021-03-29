import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    orderId: String,
    user: {
        userId: String,
        username: String,
    },
    shipping: {
        customer: String,
        address: String,
        city: String,
        state: String,
        country: String,
    },
    payment: {
        method: String,
        paymentId: String,
    },
    products: [{
        productId: String,
        quantity: Number,
        productName: String,
        bookedFrom: Date,
        bookedTo: Date,
    }],
    totalAmount: Number,
    orderTimestamp: Date,
    status: String,
})

interface IOrder extends mongoose.Document {
    user: Object,
    shipping: Object,
    payment: Object,
    products: Array<Object>,
    totalAmount: number,
    orderTimestamp: Date,
};

const Order = mongoose.model<IOrder>('Order', orderSchema);

export { Order, IOrder };