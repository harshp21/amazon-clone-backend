import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryName: String,
    categoryDescription: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});

interface ICategory extends mongoose.Document {
    categoryName: string,
    categoryDescription: string,
    isActive: boolean,
};

const Category = mongoose.model<ICategory>("Category", categorySchema);

export { Category, ICategory };

// [{
//     "categroryName": "Electronics",
//     "categoryDescription": "Electronics gadgets and accessories",
// },
// {
//     "categroryName": "Clothing",
//     "categoryDescription": "Best fashion and clothing in market",

// }, {
//     "categroryName": "Footware",
//     "categoryDescription": "Best fashion and footware in market",
// }, {
//     "categroryName": "Home Appliances",
//     "categoryDescription": "Best Home applicances ranging for all prices",
// }]