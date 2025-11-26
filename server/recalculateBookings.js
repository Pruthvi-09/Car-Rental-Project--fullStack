// Script to recalculate booking prices
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/booking.js';

dotenv.config();

const recalculateBookings = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const bookings = await Booking.find();
    console.log(`Found ${bookings.length} bookings\n`);

    for (const booking of bookings) {
      const picked = new Date(booking.pickupDate);
      const returned = new Date(booking.returnDate);
      
      picked.setHours(0, 0, 0, 0);
      returned.setHours(0, 0, 0, 0);
      
      const timeDiff = returned.getTime() - picked.getTime();
      const noOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      const pricePerDay = booking.proposedPricePerDay || (booking.originalPrice / noOfDays);
      const newPrice = Math.round(pricePerDay * noOfDays);
      
      console.log(`Booking ${booking._id}:`);
      console.log(`  Days: ${noOfDays}`);
      console.log(`  Price per day: ₹${pricePerDay}`);
      console.log(`  Old total: ₹${booking.price}`);
      console.log(`  New total: ₹${newPrice}`);
      
      if (booking.price !== newPrice) {
        booking.price = newPrice;
        await booking.save();
        console.log(`  ✓ Updated!\n`);
      } else {
        console.log(`  Already correct\n`);
      }
    }

    console.log('✅ All bookings recalculated!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

recalculateBookings();
