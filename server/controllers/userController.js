import User from "../models/User.js";
import bcrypt from 'bcrypt' //Used to hash (encrypt) passwords.bcrypt as a machine that turns "mypassword" into "@jd83hd03u30"
import jwt from 'jsonwebtoken'//JWT creates a digital ID card for the user to stay logged in.
import Car from '../models/Cars.js'


//Generate JWT Token

// const generateToken = (userId)=>{
//     const payload =userId;          //Data we put inside the token.
//     return jwt.sign(payload, process.env.JWT_SECRET) //Converts it into a signed token.ex "abc123" to 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' for identify the user in the future 
// }
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


//---------------------register User-------------------------------------------------
export const registerUser = async (req,res)=>{
    try {

        const {name,email,password,phone} =req.body //Gets data sent by user from frontend.

        if(!name || !email || !password || password.length<8){
            return res.json({success:false, message:'Fill all the fields'})
        }

        //Check if user already exists
        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success:false,message:'User already exists'})
        }
 
        const hashedPassword = await bcrypt.hash(password,10)//10 = salt rounds → strengthens the encryption
        // create new user
        const user= await User.create({name, email, password:hashedPassword, phone})

        //token
     const token = generateToken(user._id.toString());
        res.json({success:true, token})

        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

//------------------------------ User Login ------------------------------------------

export const loginUser = async (req,res)=>{
    try {

        const {email,password} =req.body
        const user= await User.findOne({email})
        if(!user){
            return res.json({success:false, message:"User not found"})
        }
        
        const isMatch= await bcrypt.compare(password,user.password)// it check incoming password and stored password is same or not

        if(!isMatch){
            return res.json({success:false, message:"Invalid Credentials"})
        }

        // when the mail and password is mtching then we all to user login 
    const token = generateToken(user._id.toString());
        res.json({success:true, token})


    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


// Get User data using Token (JWT)

export const getUserData = async (req,res)=>{
    try {
        const {user}=req;
        res.json({success:true, user})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
        
    }
}

//get all cars for the frontend--------------------------------------------
export const getCars = async (req,res)=>{
    try {
        const cars= await Car.find({}) // Get all cars regardless of availability
        
        // Check and update availability based on bookedUntil date
        const currentDate = new Date()
        for(const car of cars){
            if(!car.isAvailable && car.bookedUntil && new Date(car.bookedUntil) < currentDate){
                // Booking period has ended, make car available again
                await Car.findByIdAndUpdate(car._id, {
                    isAvailable: true,
                    bookedUntil: null
                })
                car.isAvailable = true
                car.bookedUntil = null
            }
        }
        
        res.json({success:true, cars})
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
        
    }
}