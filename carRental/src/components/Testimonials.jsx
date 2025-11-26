import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Title from './Title';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Testimonials = () => {
    const { token, user } = useContext(AppContext);
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        location: '',
        rating: 5,
        testimonial: ''
    });

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get('/api/reviews/all');
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error('Please login to submit a review');
            return;
        }

        try {
            const { data } = await axios.post('/api/reviews/create', formData);

            if (data.success) {
                toast.success('Review submitted successfully!');
                setFormData({ location: '', rating: 5, testimonial: '' });
                setShowForm(false);
                fetchReviews();
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const { data } = await axios.delete(`/api/reviews/${reviewId}`);

            if (data.success) {
                toast.success('Review deleted successfully!');
                fetchReviews();
            } else {
                toast.error(data.message || 'Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error(error.response?.data?.message || 'Failed to delete review');
        }
    };

    return (
        <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
            <Title title='What Our Customer Say' subTitle='Discover why discerning travelers choose CarRental for their car rental needs around the world'/>

            {token && (
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold mb-6">Share Your Experience</h3>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Your Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g., New York, USA"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Rating</label>
                        <select
                            value={formData.rating}
                            onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Your Review</label>
                        <textarea
                            value={formData.testimonial}
                            onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                            placeholder="Share your experience with CarRental..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Submit Review
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        const isOwner = user && (
                            String(review.userId) === String(user._id) ||
                            review.userId?._id && String(review.userId._id) === String(user._id)
                        );
                        
                        return (
                            <div key={review._id} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500 relative">
                                {isOwner && (
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="absolute top-4 right-4 bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
                                        title="Delete review"
                                    >
                                        <img src={assets.delete_icon} alt="delete" className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="flex items-center gap-3">
                                    <img 
                                        className="w-12 h-12 rounded-full object-cover" 
                                        src={review.image || assets.user_profile} 
                                        alt={review.name} 
                                    />
                                    <div>
                                        <p className="text-xl">{review.name}</p>
                                        <p className="text-gray-500">{review.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-4">
                                    {Array(review.rating).fill(0).map((_, index) => (
                                        <img key={index} src={assets.star_icon} alt="star-icon" />
                                    ))}
                                </div>
                                <p className="text-gray-500 max-w-90 mt-4 font-light">"{review.testimonial}"</p>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No reviews yet. Be the first to share your experience!
                    </div>
                )}
            </div>
        </div>
    )
}

export default Testimonials