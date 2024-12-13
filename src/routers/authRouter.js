import express from 'express'
import AuthControler from '../controllers/authController';
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction';
import upload from '../middleware/multer';

const router = express.Router();

router.post('/register', AuthControler.handleRegsiter);
router.post('/login', AuthControler.handleLogin);
router.post('/logout', AuthControler.handleLogout);
router.get('/account', checkUserJWT, AuthControler.getAccount);
router.get('/all-user', checkUserJWT, checkUserPermission, AuthControler.getAllUser);
router.get('/user/:id', checkUserJWT, AuthControler.getOneUser);
router.put('/user/:id', checkUserJWT, upload('avatar').single('avatar'), AuthControler.putUser);
router.put('/user/:id/role', checkUserJWT, checkUserPermission, AuthControler.putUserRole);
router.delete('/delete-user/:id', checkUserJWT, checkUserPermission, AuthControler.deleteUser);




module.exports = router;
