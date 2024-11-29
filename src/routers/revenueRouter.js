import express from 'express'
import RevenueController from '../controllers/revenueController'
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction'

const router = express.Router()

router.get('/dashboard-data', checkUserJWT, checkUserPermission, RevenueController.getDashboardData)


module.exports = router