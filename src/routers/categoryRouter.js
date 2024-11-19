import express from 'express'
import CategoryController from '../controllers/categoryController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction';


const router = express.Router();

router.get('/category', CategoryController.getAllCategory);
router.get('/category/:id', CategoryController.getOneCategory);
router.post('/category/create', checkUserJWT, checkUserPermission, upload('category').single('categoryImage'), checkUserPermission, CategoryController.postCategory, multerErrorHandler);
router.put('/category/update/:id', checkUserJWT, checkUserPermission, upload('category').single('categoryImage'), checkUserPermission, CategoryController.putCategory, multerErrorHandler);
router.delete('/category/delete/:id', checkUserJWT, checkUserPermission, CategoryController.deleteCategory);

module.exports = router