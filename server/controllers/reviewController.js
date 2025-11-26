import Review from '../models/Review.js'
import User from '../models/User.js'

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { location, rating, testimonial } = req.body
        const user = req.user

        if (!location || !rating || !testimonial) {
            return res.json({ success: false, message: 'All fields are required' })
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: 'Rating must be between 1 and 5' })
        }

        const review = new Review({
            userId: user._id,
            name: user.name,
            location,
            rating,
            testimonial,
            image: user.image || ''
        })

        await review.save()

        res.json({ success: true, message: 'Review submitted successfully', review })
    } catch (error) {
        console.error('Error creating review:', error)
        res.json({ success: false, message: error.message })
    }
}

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 })
        res.json({ success: true, reviews })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        res.json({ success: false, message: error.message })
    }
}

// Get user's own reviews
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user._id
        const reviews = await Review.find({ userId }).sort({ createdAt: -1 })
        res.json({ success: true, reviews })
    } catch (error) {
        console.error('Error fetching user reviews:', error)
        res.json({ success: false, message: error.message })
    }
}

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const review = await Review.findById(id)
        if (!review) {
            return res.json({ success: false, message: 'Review not found' })
        }

        if (review.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        await Review.findByIdAndDelete(id)
        res.json({ success: true, message: 'Review deleted successfully' })
    } catch (error) {
        console.error('Error deleting review:', error)
        res.json({ success: false, message: error.message })
    }
}
