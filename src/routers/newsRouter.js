import express from 'express';
import NewsController from '../controllers/newsController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { auth, checkUserJWT } from '../middleware/jwtAction';


const router = express.Router()

// router.all('*', checkUserJWT)

router.get('/news', NewsController.getAllNews);
router.get('/news/:id', NewsController.getOneNews);
router.post('/news', upload('news').single('newsImage'), NewsController.postNews, multerErrorHandler);
router.delete('/news/:id', NewsController.deleteNews);
router.put('/news/:id', upload('news').single('newsImage'), NewsController.putNews, multerErrorHandler);

module.exports = router