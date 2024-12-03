import express from 'express';
import NewsController from '../controllers/newsController';
import upload, { multerErrorHandler } from '../middleware/multer';
import { auth, checkUserJWT, checkUserPermission } from '../middleware/jwtAction';


const router = express.Router()

router.get('/news', NewsController.getAllNews);
router.get('/news/:id', NewsController.getOneNews);
router.post('/news', checkUserJWT, checkUserPermission, upload('news').single('newsImage'), NewsController.postNews, multerErrorHandler);
router.delete('/news/:id', checkUserJWT, checkUserPermission, NewsController.deleteNews);
router.put('/news/:id', checkUserJWT, checkUserPermission, upload('news').single('newsImage'), NewsController.putNews, multerErrorHandler);

module.exports = router