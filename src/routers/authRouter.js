import express from 'express'
import AuthControler from '../controllers/authController';
// const AuthControler = require('../controllers/authController');
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction';

const router = express.Router();

router.post('/register', AuthControler.handleRegsiter);
router.post('/login', AuthControler.handleLogin);
router.post('/logout', AuthControler.handleLogout);
router.get('/account', checkUserJWT, AuthControler.getAccount);
router.get('/all-user', checkUserJWT, checkUserPermission, AuthControler.getAllUser);
router.get('/user/:id', checkUserJWT, AuthControler.getOneUser);
router.delete('/delete-user/:id', checkUserJWT, checkUserPermission, AuthControler.deleteUser);




module.exports = router;
