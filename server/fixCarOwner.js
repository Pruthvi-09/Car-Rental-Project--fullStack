// Script to assign owner to cars that are missing it
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Cars.js';
import User from './models/User.js';

dotenv.config();

const fixCarOwner = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Find cars without owner
    const carsWithoutOwner = await Car.find({ 
      $or: [
        { owner: null },
        { owner: { $exists: false } }
      ]
    });

    console.log(`Found ${carsWithoutOwner.length} cars without owner`);

    if (carsWithoutOwner.length === 0) {
      console.log('All cars have owners!');
      process.exit(0);
    }

    // Find an owner user (role: 'owner')
    let owner = await User.findOne({ role: 'owner' });

    if (!owner) {
      // If no owner exists, find any user and make them owner
      owner = await User.findOne();
      if (owner) {
        owner.role = 'owner';
        await owner.save();
        console.log(`Made ${owner.name || owner.email} an owner`);
      } else {
        console.log('❌ No users found in database. Please create a user first.');
        process.exit(1);
      }
    }

    console.log(`Using owner: ${owner.name || owner.email} (${owner._id})`);

    // Assign owner to all cars without one
    for (const car of carsWithoutOwner) {
      await Car.findByIdAndUpdate(car._id, { owner: owner._id });
      console.log(`✓ Assigned owner to ${car.brand} ${car.model}`);
    }

    console.log('\n✅ All cars now have owners!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixCarOwner();
