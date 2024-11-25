import express from 'express'
import OrderController from '../controllers/orderController'
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction'

const router = express.Router()

router.get('/all-order', checkUserJWT, checkUserPermission, OrderController.getAllOrder)
router.get('/order/:orderIdCode', checkUserJWT, OrderController.getOneOrder)
router.put('/update/:orderIdCode', checkUserJWT, checkUserPermission, OrderController.putOrder)

module.exports = router