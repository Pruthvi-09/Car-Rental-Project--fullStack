import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    testimonial: { type: String, required: true },
    image: { type: String, default: '' }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

export default Review
