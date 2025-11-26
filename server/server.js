import express from 'express'
import "dotenv/config"
import cors from 'cors'
import connectDB from './configs/db.js'
import userRoutes from './routes/userRoutes.js'
import ownerRouter from './routes/ownerRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'
import reviewRouter from './routes/reviewRoutes.js'
import adminRouter from './routes/adminRoutes.js'

const app=express()
const PORT=process.env.PORT || 3000

// DB connection
await connectDB();

// middleware 
app.use(cors())//It allows your frontend and backend to talk to each other.

//If someone sends JSON, convert it into JavaScript object and store it in req.body.”
app.use(express.json()); //Automatically read and convert incoming JSON data

app.get('/',(req,res)=>res.send("server is running!!!!!!"))

//user
app.use('/api/user',userRoutes)

//owner
app.use('/api/owner',ownerRouter)

//booking
app.use('/api/bookings',bookingRouter)

//reviews
app.use('/api/reviews',reviewRouter)

//admin
app.use('/api/admin',adminRouter)



app.listen(PORT,()=>{
    console.log(`Server running on port`)
})