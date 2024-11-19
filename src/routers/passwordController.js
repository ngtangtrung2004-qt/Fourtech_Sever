import express from 'express'
// import AuthControler from '../controllers/authController';
const PasswordController = require('../controllers/passwordController');

const router = express.Router();


router.post('/forgot-password', PasswordController.forgotPassword);
router.post('/reset-password', PasswordController.resetPassword);



module.exports = router;
