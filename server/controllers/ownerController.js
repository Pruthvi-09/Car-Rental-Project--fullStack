import { format } from "path";
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from 'fs'
import Car from "../models/Cars.js";
import Booking from "../models/booking.js";


//  API to Change Role of User---------------------------------------------------------------------------------------------
export const changeRoleToOwner = async (req,res)=>{

    try {

        const {_id}= req.user; // from protect

        
    if (!_id) {
      return res.status(401).json({
        success: false,
        message: "Login first"
      });
    }

        await User.findByIdAndUpdate(_id,{role:"owner"})
        res.json({success:true, message:"now you can list cars" })
        
    } catch (error) {

        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }

}


// export const addCar = async (req,res)=>{
//     try {

//         const {_id}=req.user;
//         let car =JSON.parse(req.body.carData);// req.body is only for text, not binary files. req.body = {    carData: '{"brand":"BMW","model":"i8"}'}
//         const imageFile = req.file;

//         // Upload image to image kit
//         const fileBuffer=fs.readdirSync(imageFile.path)
//         const response = await imagekit.upload({
//             file:fileBuffer,
//             fileName:imageFile.originalname,
//             folder:'/cars'
//         })

//         //optimization through imagekit URL transformation

//         const optimizedImageUrl = imagekit.url({
//                  path: response.filePath,
//                   transformation: [
//                            { width:' 1280' }, // width resize
//                            {quality:'auto'}, //Auto cpmpression
//                            {format:'webp'} // Convert to modern format
//                          ]

//               });

//               const image= optimizedImageUrl;
//               await  Car.create({...car, owner:_id,image})

//               res.json({success:true, message:"Car Added"})

// console.log(url);




        
//     } catch (error) {

//         console.log(error.message)
//         res.json({success:false,message:error.message})
        
//     }
// }


//API to List Car----------------------------------------------------------------------------------------
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    const car = JSON.parse(req.body.carData);
    const file = req.files?.image?.[0];
    const additionalFiles = req.files?.additionalImages || [];

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Upload main image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/cars",
    });

    // Create optimized URL for main image
    const optimizedImageUrl = imagekit.url({
      src: uploadResponse.url,
      transformation: [
        { width: 1280 },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    // Upload additional images
    const additionalImageUrls = [];
    for (const additionalFile of additionalFiles) {
      const additionalUploadResponse = await imagekit.upload({
        file: additionalFile.buffer,
        fileName: `${Date.now()}-${additionalFile.originalname}`,
        folder: "/cars",
      });

      const additionalOptimizedUrl = imagekit.url({
        src: additionalUploadResponse.url,
        transformation: [
          { width: 1280 },
          { quality: "auto" },
          { format: "webp" },
        ],
      });

      additionalImageUrls.push(additionalOptimizedUrl);
    }

    // Save car with all images
    await Car.create({
      ...car,
      owner: _id,
      image: optimizedImageUrl,
      images: [optimizedImageUrl, ...additionalImageUrls], // Include main image in images array
    });

    res.json({ success: true, message: "Car Added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



//API to list owner cars------------------------------------------------------------------------------------------------------

export const getOwnerCars = async (req,res)=>{
    try {

        const {_id}= req.user
        const cars = await Car.find({owner:_id})
        res.json({success:true, cars})
        
    } catch (error) {

     console.log(error);
    res.json({ success: false, message: error.message });
        
    }
} 


//API to Toggle car availability-----------------------------------------------------------------------------------

export const toggleCarAvailability= async (req,res)=>{

    try {

        const {_id}= req.user;
        const {carId}=req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: 'Unauthorized'})
        }

        car.isAvailable = !car.isAvailable;
        await car.save()

        const message = car.isAvailable ? 'Car is available now' : 'Car is unavailable now'
        res.json({success:true, message})
        
    } catch (error) {

     console.log(error);
    res.json({ success: false, message: error.message });
        
    }
    
}



// API to remove a car from owner after booking -------------------------------------------------------------

export const deleteCar= async (req,res)=>{

    try {

        const {_id}= req.user;
        const {carId}=req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: 'Unauthorized'})
        }

        car.owner=null;
        car.isAvailable=false;
        await car.save()

        res.json({success:true, message:'Car Removed'})
        
    } catch (error) {

     console.log(error);
    res.json({ success: false, message: error.message });
        
    }
    
}

// API to get Dashboard Data------------------------------------------------------------------------------------------------------------------------------

export const getDashboardData= async (req,res)=>{

    try {
             const {_id,role}= req.user;

             if(role != 'owner')
             {
                 return res.json({ success: false, message: 'Unauthorized'})
             }

             const cars = await Car.find({owner:_id})
            //  const bookings=(await Booking.find({owner:_id}).populate('car')).toSorted({createdAt:-1});
             const bookings = (
  await Booking.find({ owner: _id }).populate('car')
).toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


             const pendingBookings= await Booking.find({owner:_id, status:"pending"});
              const completedBookings= await Booking.find({owner:_id, status:"confirmed"});

              //calculate monthlyRevenue from bookings where status is confirmed
              const monthlyRevenue = bookings.slice().filter(booking => booking.status==='confirmed').reduce((acc,booking)=> acc+booking.price,0)

              const dashboardData={
                totalCars:cars.length,
                totalBookings:bookings.length,
                pendingBookings:pendingBookings.length,
                completedBookings: completedBookings.length,
                recentBookings:bookings.slice(0,3),
                monthlyRevenue

              };

              
    return res.json({ success: true, data: dashboardData })

    } catch (error) {

             console.log(error);
             res.json({ success: false, message: error.message });
        
    }
}



//API to update user image---------------------------------------------------------------------------------------------------------------------------------------------------------------

export const updateUserImage= async (req,res)=>{

  try {

     const {_id }= req.user;

       const file = req.file;
        // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: "/users",
    });

    // Create optimized URL
    const optimizedImageUrl = imagekit.url({
      src: uploadResponse.url,   // <-- correct
      transformation: [
        { width: 400  },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id,{image});
    res.json({success:true, message:'Image Updated'})


    
  } catch (error) {

    
             console.log(error);
             res.json({ success: false, message: error.message });
    
  }
}
