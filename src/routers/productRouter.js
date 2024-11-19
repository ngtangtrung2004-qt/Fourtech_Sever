import express from "express";
import ProductController from "../controllers/productController";
import upload, { multerErrorHandler } from "../middleware/multer";
import { auth, checkUserJWT } from "../middleware/jwtAction";

const router = express.Router();

router.all('*', checkUserJWT)

router.get('/product', ProductController.getAllProduct);
router.get('/product/:id', ProductController.getOneProduct);
router.post('/product/create', upload('product').array('imageProduct', 5), ProductController.postProduct, multerErrorHandler);
router.post('/product/:id/increase-view', ProductController.postView);
router.put('/product/update/:id', upload('product').array('image', 5), ProductController.putProduct, multerErrorHandler);
router.delete('/product/delete/:id', ProductController.deleteProduct);

// router.get('/search',ProductController.searchProduct)

module.exports = router;