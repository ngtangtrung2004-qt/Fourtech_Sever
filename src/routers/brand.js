import express from 'express';
import BrandController from '../controllers/brandController';
const router = express.Router()

router.get('/brand', BrandController.getAllBrand);
router.get('/brand/:id', BrandController.getOneBrand);
router.post('/brand/create', BrandController.postBrand);
router.put('/brand/update/:id', BrandController.putBrand);
router.delete('/brand/delete/:id', BrandController.deleteBrand);

module.exports = router