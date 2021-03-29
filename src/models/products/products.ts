import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: String,

    productTitle: String,

    productDescription: String,

    quantityAvailable: Number,


    productCategory: [{
        categoryId: String,
        categoryTag: String,
    }],

    manufactureDetails: {
        model_number: String,
        release_date: Date,
        brand: String,
    },

    pricing: {
        productPrice: Number,
        currency: String,
    }


})

interface IProduct extends mongoose.Document {
    productName: string,
    productTitle: string,
    productDescription: string,
    quantity: number,
    productCategory: Array<Object>,
    manufactureDetails: Object,
    pricing: Object,
};

const Product = mongoose.model<IProduct>('Product', productSchema);

export { Product, IProduct };