// importing 
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoute from './routes/user/user-route';
import productRoute from './routes/product/product-route';
import cartRoute from './routes/cart/cart-route';
import bookRoute from './routes/book/book-route';
import paymentRoute from './routes/payment/payment-route';
import orderRoute from './routes/order/order-route';

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.REQUEST_ORIGIN
}))

// routes
app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/book', bookRoute);
app.use('/payment', paymentRoute);
app.use('/orders', orderRoute);

// db config
const connectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to mongodb")).catch(err => console.log("mongo error", err));

// listen on port
app.listen(port, () => console.log(`listening on port : ${port}`));
