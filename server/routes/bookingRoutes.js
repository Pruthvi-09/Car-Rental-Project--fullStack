import express from 'express'
import { acceptCounterOffer, cancelBooking, changeBookingStatus, checkAvailabilityOfCar, createBooking, getCarBookings, getOwnerBookings, getUserBookings, sendCounterOffer } from '../controllers/bookingController.js';
import {protect} from '../middleware/auth.js'

const bookingRouter= express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)

bookingRouter.post('/create',protect, createBooking)

bookingRouter.get('/user',protect, getUserBookings)

bookingRouter.get('/owner',protect,getOwnerBookings)

bookingRouter.post('/change-status',protect,changeBookingStatus)

bookingRouter.post('/cancel',protect,cancelBooking)

bookingRouter.post('/counter-offer',protect,sendCounterOffer)

bookingRouter.post('/accept-counter',protect,acceptCounterOffer)

// Public route - no auth required
bookingRouter.get('/car/:carId', getCarBookings)

export default bookingRouter;


