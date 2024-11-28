import express from 'express'
import RevenueController from '../controllers/revenueController'

const router = express.Router()

router.get('/dashboard-data', RevenueController.getDashboardData)


module.exports = router