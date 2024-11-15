import express from 'express'
import CategoryController from '../controllers/categoryController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { auth } from '../middleware/jwtAction';


const router = express.Router();


router.all('*', auth)

router.get('/category', CategoryController.getAllCategory);
router.get('/category/:id', CategoryController.getOneCategory);
router.post('/category/create', upload('category').single('categoryImage'), CategoryController.postCategory, multerErrorHandler);
router.put('/category/update/:id', upload('category').single('categoryImage'), CategoryController.putCategory, multerErrorHandler);
router.delete('/category/delete/:id', CategoryController.deleteCategory);

module.exports = router