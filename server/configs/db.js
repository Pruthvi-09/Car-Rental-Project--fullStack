import mongoose from 'mongoose'

const connectDB =async ()=>{

    try {
            // After connect console message will be displayed in console
        mongoose.connection.on('connected', () => {
        console.log('Database Connected');
        });

         // this will connect to the mongoose db with proper options
        await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        })
        
    } catch (error) {
        console.log('Database connection error:', error.message);
    }

}

export default connectDB;