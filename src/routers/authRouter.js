import express from 'express'
import AuthControler from '../controllers/authController';

const router = express.Router();

router.post('/register', AuthControler.handleRegsiter);
router.post('/login', AuthControler.handleLogin);

module.exports = router;
