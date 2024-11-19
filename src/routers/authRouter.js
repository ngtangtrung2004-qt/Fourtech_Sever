import express from 'express'
import AuthControler from '../controllers/authController';
// const AuthControler = require('../controllers/authController');
import { auth, checkUserJWT, checkUserPermission } from '../middleware/jwtAction';

const router = express.Router();
// router.all('*', checkUserJWT, checkUserPermission)

router.post('/register', AuthControler.handleRegsiter);
router.post('/login', AuthControler.handleLogin);
router.post('/logout', AuthControler.handleLogout);
router.get('/account', AuthControler.getAccount);
router.get('/all-user', AuthControler.getAllUser);
router.delete('/delete-user/:id', AuthControler.deleteUser);




module.exports = router;
