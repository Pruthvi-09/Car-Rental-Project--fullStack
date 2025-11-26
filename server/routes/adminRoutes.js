import express from 'express';
import Car from '../models/Cars.js';
import Booking from '../models/booking.js';

const router = express.Router();

// API to refresh all car availability based on current bookings
router.post('/refresh-availability', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cars = await Car.find();
    let updated = 0;

    for (const car of cars) {
      const activeBookings = await Booking.find({
        car: car._id,
        status: { $in: ['pending', 'confirmed'] },
        returnDate: { $gte: today }
      }).sort({ pickupDate: 1 });

      if (activeBookings.length === 0) {
        await Car.findByIdAndUpdate(car._id, {
          isAvailable: true,
          bookedUntil: null
        });
        updated++;
      } else {
        const currentBooking = activeBookings.find(booking => {
          const pickupDate = new Date(booking.pickupDate);
          pickupDate.setHours(0, 0, 0, 0);
          return pickupDate <= today;
        });

        if (currentBooking) {
          await Car.findByIdAndUpdate(car._id, {
            isAvailable: false,
            bookedUntil: currentBooking.returnDate
          });
        } else {
          const nextBooking = activeBookings[0];
          await Car.findByIdAndUpdate(car._id, {
            isAvailable: true,
            bookedUntil: nextBooking.returnDate
          });
        }
        updated++;
      }
    }

    res.json({ success: true, message: `Updated ${updated} cars` });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;
