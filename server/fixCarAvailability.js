// Script to fix car availability based on actual bookings
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Cars.js';
import Booking from './models/booking.js';

dotenv.config();

const fixCarAvailability = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all cars
    const cars = await Car.find();
    console.log(`Found ${cars.length} cars`);

    for (const car of cars) {
      // Check if car has owner
      if (!car.owner) {
        console.log(`⚠️  ${car.brand} ${car.model}: Missing owner field!`);
        continue;
      }

      // Find active bookings for this car
      const activeBookings = await Booking.find({
        car: car._id,
        status: { $in: ['pending', 'confirmed'] },
        returnDate: { $gte: today } // Only future or current bookings
      }).sort({ pickupDate: 1 });

      if (activeBookings.length === 0) {
        // No active bookings - car should be available
        await Car.findByIdAndUpdate(car._id, {
          isAvailable: true,
          bookedUntil: null
        });
        console.log(`✓ ${car.brand} ${car.model}: Set to AVAILABLE (no bookings)`);
      } else {
        // Check if any booking has started
        const currentBooking = activeBookings.find(booking => {
          const pickupDate = new Date(booking.pickupDate);
          pickupDate.setHours(0, 0, 0, 0);
          return pickupDate <= today;
        });

        if (currentBooking) {
          // Car is currently booked
          await Car.findByIdAndUpdate(car._id, {
            isAvailable: false,
            bookedUntil: currentBooking.returnDate
          });
          console.log(`✗ ${car.brand} ${car.model}: Set to UNAVAILABLE (booked until ${new Date(currentBooking.returnDate).toDateString()})`);
        } else {
          // Car has future bookings but is available now
          const nextBooking = activeBookings[0];
          await Car.findByIdAndUpdate(car._id, {
            isAvailable: true,
            bookedUntil: nextBooking.returnDate
          });
          console.log(`✓ ${car.brand} ${car.model}: Set to AVAILABLE (next booking: ${new Date(nextBooking.pickupDate).toDateString()})`);
        }
      }
    }

    console.log('\n✅ Car availability fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixCarAvailability();
