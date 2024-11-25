import express from 'express'
import PaymentMethodController from '../controllers/paymentController'

const router = express.Router()

router.post('/create_payment_momo', PaymentMethodController.postCreatePaymentMomo)
router.post('/callback_payment', PaymentMethodController.postCallbackPaymentMomo)
router.post('/create_payment_cod', PaymentMethodController.postCreatePaymentCOD)

module.exports = router