// Script to check booking details
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.js';

dotenv.config();

const checkBookingDetails = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(1);
    
    if (bookings.length === 0) {
      console.log('No bookings found');
      process.exit(0);
    }

    const booking = bookings[0];
    
    console.log('Latest Booking Details:');
    console.log('='.repeat(60));
    console.log(`ID: ${booking._id}`);
    console.log(`Status: ${booking.status}`);
    console.log(`Pickup: ${booking.pickupDate}`);
    console.log(`Return: ${booking.returnDate}`);
    console.log(`\nPricing:`);
    console.log(`  Original Price Per Day: ₹${booking.originalPrice / 2}`);
    console.log(`  Proposed Price Per Day: ₹${booking.proposedPricePerDay}`);
    console.log(`  Is Bargained: ${booking.isBargained}`);
    console.log(`  Original Total: ₹${booking.originalPrice}`);
    console.log(`  Final Total: ₹${booking.price}`);
    console.log(`\nRaw Data:`);
    console.log(JSON.stringify(booking, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBookingDetails();
