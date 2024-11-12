import express from 'express'
import CategoryController from '../controllers/categoryController';
import upload from '../config/configMulter';
import { checkUserJWT } from '../middleware/jwtAction';
import path from 'path'

const router = express.Router();

router.get('/category', CategoryController.getAllCategory);
router.get('/category/:id', CategoryController.getOneCategory);
router.post('/category/create', upload('category').single('categoryImage'), CategoryController.postCategory);
router.put('/category/update/:id', upload('category').single('categoryImage'), CategoryController.putCategory);
router.delete('/category/delete/:id', CategoryController.deleteCategory);

module.exports = router