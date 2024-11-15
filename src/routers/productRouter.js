import express from "express";
import ProductController from "../controllers/productController";
import upload, { multerErrorHandler } from "../middleware/multer";
import { auth } from "../middleware/jwtAction";

const router = express.Router();

router.all('*', auth)

router.get('/product', ProductController.getAllProduct);
router.get('/product/:id', ProductController.getOneProduct);
router.post('/product/create', upload('product').array('imageProduct', 5), ProductController.postProduct, multerErrorHandler);
router.post('/product/:id/increase-view', ProductController.postView);
router.put('/product/update/:id', upload('product').array('image', 5), ProductController.putProduct, multerErrorHandler);
router.delete('/product/delete/:id', ProductController.deleteProduct);

module.exports = router;