import express from 'express'
import { createReview, getAllReviews, getUserReviews, deleteReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/auth.js'

const reviewRouter = express.Router()

reviewRouter.post('/create', protect, createReview)
reviewRouter.get('/all', getAllReviews)
reviewRouter.get('/user', protect, getUserReviews)
reviewRouter.delete('/:id', protect, deleteReview)

export default reviewRouter
