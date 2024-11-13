import express from "express";
import ProductController from "../controllers/productController";
import upload from "../config/configMulter";

const router = express.Router();

router.get('/product', ProductController.getAllProduct);
router.get('/product/:id', ProductController.getOneProduct);
router.post('/product/create', upload('product').array('imageProduct', 10), ProductController.postProduct);
router.put('/product/update/:id', ProductController.putProduct);
router.delete('/product/delete/:id', ProductController.deleteProduct);

module.exports = router;