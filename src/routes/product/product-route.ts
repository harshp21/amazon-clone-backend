//importing
import express, { Request, Response, Router } from 'express';
import { Category, ICategory } from '../../models/categories/category';
import { IProduct, Product } from '../../models/products/products';

// router config
const router: Router = express.Router();

// fetching all products by category
router.get('/category-wise-products', async (req: Request, res: Response) => {
    try {

        // fetching al categories available
        const categories: Array<ICategory> = await Category.find({ isActive: true });
        let productPromises = [];

        // fetching products and organizing them by category
        categories.forEach(async (category: ICategory) => {
            productPromises.push(Product.find({ 'productCategory.categoryId': category._id }).limit(5));
        })

        // waiting for all the products to be fetched by category
        const products = await Promise.all(productPromises);

        // generating product response by category 
        const categoryWiseProducts = categories.map((category, index) => {
            return {
                category,
                productList: products[index]
            }
        })
        res.json({
            message: 'Products fetched successfully',
            categoryWiseProducts
        })

    } catch (err) {
        res.status(401).json({
            message: 'Failed to fetch products',
        })
    }
});

// fetch a product by the given id
router.get('/:productId', async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        // fetch the product and send to the user
        const product: IProduct = await Product.findOne({ _id: productId });
        if (product) {
            res.json({
                message: 'Product successfully fetched',
                product
            })
        } else {
            res.status(401).json({
                message: 'Product not found',
            })
        }
    } catch (err) {
        res.status(401).json({
            message: 'Product not found',
        })
    }
})

export default router;