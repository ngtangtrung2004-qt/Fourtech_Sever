import express from "express";
import ProductController from "../controllers/productController";
import upload, { multerErrorHandler } from "../middleware/multer";
import { auth, checkUserJWT, checkUserPermission } from "../middleware/jwtAction";

const router = express.Router();

router.get('/product', ProductController.getAllProduct);
router.get('/product-trash', checkUserJWT, checkUserPermission, ProductController.getAllProductTrash);
router.get('/product/:id', ProductController.getOneProduct);
router.post('/product/create', checkUserJWT, checkUserPermission, upload('product').array('imageProduct', 5), ProductController.postProduct, multerErrorHandler);
router.post('/product/increase-view/:id', ProductController.postView);
router.put('/product/update/:id', checkUserJWT, checkUserPermission, upload('product').array('image', 5), ProductController.putProduct, multerErrorHandler);
router.delete('/product/delete-soft/:id', checkUserJWT, checkUserPermission, ProductController.deleteSoftProduct);
router.put('/product/restore/:id', checkUserJWT, checkUserPermission, ProductController.restoreProduct);
router.delete('/product/delete/:id', checkUserJWT, checkUserPermission, ProductController.deleteProduct);

router.get('/search',ProductController.searchProduct)

module.exports = router;