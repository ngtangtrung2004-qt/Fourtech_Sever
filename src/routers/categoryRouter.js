import express from 'express'
import CategoryController from '../controllers/categoryController';
import { checkUserJWT } from '../middleware/jwtAction';

const router = express.Router();

router.get('/category', CategoryController.getAllCategory);
router.get('/category/:id', CategoryController.getOneCategory);
router.post('/category/create', CategoryController.postCategory);
router.put('/category/update/:id', CategoryController.putCategory);
router.delete('/category/delete/:id', CategoryController.deleteCategory);

module.exports = router