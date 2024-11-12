import express from 'express'

import ImageController from '../controllers/imageController';

const router = express.Router();

router.get('/hinh-anh/:type/:filename', ImageController.getImage);

module.exports = router