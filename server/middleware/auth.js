// import jwt from 'jsonwebtoken';
// import User from "../models/User.js";

// export const protect =async(req, res,next)=>{
//     const token=req.headers.authorization;// 

//     if(!token){
//         return res.json({success:false, message:'not authorized'})
//     }

//     try {

//         const userId = jwt.decode(token,  process.env.JWT_SECRET)

//         if(!userId){
//               return res.json({success:false, message:'not authorized'})
//         }
        
//         req.user= await User.findById(userId).select("-password")
//         next();
//     } catch (error) {
//           return res.json({success:false, message:'not authorized'})
        
//     }
// }

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided."
      });
    }

    // Remove 'Bearer ' prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verify the token (not decode)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id contains the user's ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user; // attach logged-in user to request
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
