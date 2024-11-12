import express from 'express'
import AuthControler from '../controllers/authController';

const router = express.Router();

router.post('/register', AuthControler.handleRegsiter);
router.post('/login', AuthControler.handleLogin);
router.get('/all-user', AuthControler.getAllUser);
router.delete('/delete-user/:id', AuthControler.deleteUser);

module.exports = router;
