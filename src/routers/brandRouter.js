import express from 'express';
import BrandController from '../controllers/brandController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { auth, checkUserJWT } from '../middleware/jwtAction';


const router = express.Router()

// router.all('*', checkUserJWT)

router.get('/brand', BrandController.getAllBrand);
router.get('/brand/:id', BrandController.getOneBrand);
router.post('/brand/create', upload('brand').single('brandImage'), BrandController.postBrand, multerErrorHandler);
router.put('/brand/update/:id', upload('brand').single('brandImage'), BrandController.putBrand, multerErrorHandler);
router.delete('/brand/delete/:id', BrandController.deleteBrand);

module.exports = router