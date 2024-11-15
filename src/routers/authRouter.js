import express from 'express'
import AuthControler from '../controllers/authController';
import { auth } from '../middleware/jwtAction';

const router = express.Router();

router.all('*', auth)

router.post('/register', AuthControler.handleRegsiter);
router.post('/login', AuthControler.handleLogin);
router.get('/all-user', AuthControler.getAllUser);
router.delete('/delete-user/:id', AuthControler.deleteUser);


router.post('/forgot-password', AuthControler.forgotPassword);
router.post('/reset-password', AuthControler.resetPassword);


module.exports = router;
