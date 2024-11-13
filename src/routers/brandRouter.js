import express from 'express';
import BrandController from '../controllers/brandController';
import upload from '../config/configMulter';


const router = express.Router()

router.get('/brand', BrandController.getAllBrand);
router.get('/brand/:id', BrandController.getOneBrand);
router.get('/brand/categor/:categoryId', BrandController.getBrandsByCategory);
router.post('/brand/create', upload('brand').single('brandImage'), BrandController.postBrand);
router.put('/brand/update/:id', upload('brand').single('brandImage'), BrandController.putBrand);
router.delete('/brand/delete/:id', BrandController.deleteBrand);

module.exports = router