// Script to check all bookings for a car
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Cars.js';
import Booking from './models/booking.js';

dotenv.config();

const checkBookings = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const cars = await Car.find();
    
    for (const car of cars) {
      console.log(`\n🚗 Car: ${car.brand} ${car.model}`);
      console.log(`   ID: ${car._id}`);
      console.log(`   isAvailable: ${car.isAvailable}`);
      console.log(`   bookedUntil: ${car.bookedUntil ? new Date(car.bookedUntil).toDateString() : 'null'}`);
      
      const bookings = await Booking.find({ car: car._id }).sort({ pickupDate: 1 });
      
      console.log(`\n   📅 Bookings (${bookings.length} total):`);
      
      if (bookings.length === 0) {
        console.log('   No bookings found');
      } else {
        bookings.forEach((booking, index) => {
          const pickup = new Date(booking.pickupDate);
          const returnDate = new Date(booking.returnDate);
          console.log(`\n   ${index + 1}. Status: ${booking.status}`);
          console.log(`      Pickup:  ${pickup.toDateString()}`);
          console.log(`      Return:  ${returnDate.toDateString()}`);
          console.log(`      User:    ${booking.user}`);
        });
      }
      console.log('\n' + '='.repeat(60));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBookings();
