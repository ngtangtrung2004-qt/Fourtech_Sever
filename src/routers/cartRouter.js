import express from 'express'
import CartController from '../controllers/cartController'
import { checkUserJWT } from '../middleware/jwtAction'

const router = express.Router()

router.get('/cart/:user_id', checkUserJWT, CartController.getCart)
router.post('/add-to-cart', checkUserJWT, CartController.postCart)
router.delete('/delete-cart_item/:cartId/product/:productId', checkUserJWT, CartController.deleteCartItem)


module.exports = router