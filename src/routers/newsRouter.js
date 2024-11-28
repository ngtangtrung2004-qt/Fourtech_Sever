import express from 'express';
import NewsController from '../controllers/newsController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { auth, checkUserJWT } from '../middleware/jwtAction';


const router = express.Router()

// router.all('*', checkUserJWT)

router.get('/news', NewsController.getAllNews);
router.get('/news/:id', NewsController.getOneNews);
router.post('/news', upload('news').single('newsImage'), NewsController.postNews, multerErrorHandler);
// router.put('/news/update/:id', upload('brand').single('brandImage'), NewsController.putNews, multerErrorHandler);
router.delete('/news/:id', NewsController.deleteNews);

module.exports = router