import express from 'express'
import CartController from '../controllers/cartController'
import { checkUserJWT } from '../middleware/jwtAction'

const router = express.Router()

router.all('*', checkUserJWT)

router.get('/cart/:user_id', CartController.getCart)
router.post('/add-to-cart', CartController.postCart)


module.exports = router