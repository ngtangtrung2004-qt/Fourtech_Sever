import express from 'express'
import CategoryController from '../controllers/categoryController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction';


const router = express.Router();


router.all('*', checkUserJWT)
router.get('/category', CategoryController.getAllCategory);

router.get('/category/:id', CategoryController.getOneCategory);
router.post('/category/create', upload('category').single('categoryImage'), checkUserPermission, CategoryController.postCategory, multerErrorHandler);
router.put('/category/update/:id', upload('category').single('categoryImage'), checkUserPermission, CategoryController.putCategory, multerErrorHandler);
router.delete('/category/delete/:id', CategoryController.deleteCategory);

module.exports = router