
import Booking from "../models/booking.js";
import Car from "../models/Cars.js";


// Function to check Availability of cars for a given date----------------------------------------------------------------------------------------------
const checkAvailability = async (car, pickupDate, returnDate)=>{
    // Convert string dates to Date objects for proper comparison
    const requestedPickup = new Date(pickupDate);
    const requestedReturn = new Date(returnDate);
    
    // Set time to start of day for accurate date-only comparison
    requestedPickup.setHours(0, 0, 0, 0);
    requestedReturn.setHours(0, 0, 0, 0);
    
    const bookings = await Booking.find({
        car,
        status: {$in: ['pending', 'confirmed']} // Only check active bookings
    })

    // Check each booking for actual date overlap
    const overlappingBookings = bookings.filter(booking => {
        const existingPickup = new Date(booking.pickupDate);
        const existingReturn = new Date(booking.returnDate);
        
        existingPickup.setHours(0, 0, 0, 0);
        existingReturn.setHours(0, 0, 0, 0);
        
        // Dates DON'T overlap if:
        // - Requested ends before existing starts: requestedReturn < existingPickup
        // - Requested starts after existing ends: requestedPickup > existingReturn
        //
        // So they DO overlap if neither of the above is true
        // 
        // Example: Existing: Nov 29-30
        //          Requested: Nov 27-28
        //          Does 28 < 29? YES -> Ends before it starts -> NO OVERLAP ✓
        //
        //          Requested: Nov 28-29
        //          Does 29 < 29? NO
        //          Does 28 > 30? NO -> OVERLAP ✗
        //
        //          Requested: Nov 30-Dec 1
        //          Does Dec 1 < Nov 29? NO
        //          Does Nov 30 > Nov 30? NO -> OVERLAP ✗
        //
        //          Requested: Dec 1-2
        //          Does Dec 2 < Nov 29? NO
        //          Does Dec 1 > Nov 30? YES -> Starts after it ends -> NO OVERLAP ✓
        
        const hasOverlap = !(requestedReturn < existingPickup || requestedPickup > existingReturn);
        
        console.log(`    Checking: Requested ${requestedPickup.toDateString()} to ${requestedReturn.toDateString()} vs Existing ${existingPickup.toDateString()} to ${existingReturn.toDateString()}`);
        console.log(`    Does requested end (${requestedReturn.toDateString()}) < existing start (${existingPickup.toDateString()})? ${requestedReturn < existingPickup}`);
        console.log(`    Does requested start (${requestedPickup.toDateString()}) > existing end (${existingReturn.toDateString()})? ${requestedPickup > existingReturn}`);
        console.log(`    Result: ${hasOverlap ? 'OVERLAP ❌' : 'NO OVERLAP ✓'}`);
        
        if(hasOverlap) {
            console.log(`    ❌ Overlap found: Existing ${existingPickup.toDateString()} to ${existingReturn.toDateString()}`);
        }
        
        return hasOverlap;
    });

    console.log(`    Checking availability: ${overlappingBookings.length} overlapping bookings found`);
    
    return overlappingBookings.length === 0;
}


// API  to check Availability of cars for the given date and location---------------------------------------------------------------------------------------------------

// export const checkAvailabilityOfCar = async (req,res)=>{
//     try {

//         const {location, pickupDate, returnDate}=req.body;
//         //fetch all available cars for the given location (case-insensitive)

//         const cars = await Car.find({
//             location: { $regex: new RegExp(`^${location}$`, 'i') },
//             isAvailable:true
//         })

//         //check car availability for the given date range using promise
//         const availableCarsPromises = cars.map( async (car)=>{
//             const isAvailable= await checkAvailability(car._id,pickupDate, returnDate)// it retuen whether  there has any overlap  or not true /false

//             return {...car._doc, isAvailable: isAvailable} //car._doc = only the actual data from MongoDB || car = data + extra Mongoose stuff
//         })

//         let availableCars = await Promise.all(availableCarsPromises);
//         availableCars= availableCars.filter(car => car.isAvailable === true)

//         res.json({success:true, availableCars})
        
//     } catch (error) {
//         console.log(error.message)
//         res.json({success:false, message: error.message})
        
//     }
// }

export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    console.log('\n=== SEARCH REQUEST ===')
    console.log('Location:', location)
    console.log('Pickup:', pickupDate)
    console.log('Return:', returnDate)

    if (!location || !pickupDate || !returnDate) {
      console.log('❌ Missing fields!')
      return res.json({ success: false, message: "Missing fields" });
    }

    // find cars by location
    const cars = await Car.find({
      location: { $regex: new RegExp(`^${location}$`, "i") }
    });

    console.log(`Found ${cars.length} cars in ${location}`)

    // check each car availability for the requested dates
    const availableCarsPromises = cars.map(async (car) => {
      // Check if there are any overlapping bookings for the requested dates
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      
      console.log(`  ${car.brand} ${car.model}: ${isAvailable ? '✓ AVAILABLE' : '✗ BOOKED'}`)
      
      return { 
        ...car.toObject(), 
        isAvailable: isAvailable
      };
    });

    let availableCars = await Promise.all(availableCarsPromises);

    // filter only available cars (including future bookings)
    availableCars = availableCars.filter((car) => car.isAvailable);
    
    console.log(`Result: ${availableCars.length} available cars`)
    console.log('==================\n')

    return res.json({ success: true, availableCars });
  } catch (error) {
    console.log("Error in checkAvailabilityOfCar:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

//API to create Booking ------------------------------------------------------------------------------------------------------------------------------

export const createBooking =  async(req,res)=>{
    try {

        const {_id}=req.user;
        const {car,pickupDate,returnDate,paymentMethod,proposedPricePerDay}=req.body;

        if(!paymentMethod || !['online', 'offline'].includes(paymentMethod)){
            return res.json({success:false, message:"Invalid payment method"})
        }

        // First, get car data to check if it exists
        const carData = await Car.findById(car)
        
        if(!carData){
            return res.json({success:false, message:"Car not found"})
        }

        if(!carData.owner){
            return res.json({success:false, message:"Car owner information missing"})
        }

        const isAvailable = await checkAvailability(car,pickupDate,returnDate)
        if(!isAvailable){
            return res.json({success:false, message:"Car not available for selected dates"})
        }

        // Calculate price based on pickupdate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        
        // Set to start of day to avoid time zone issues
        picked.setHours(0, 0, 0, 0);
        returned.setHours(0, 0, 0, 0);
        
        // Calculate days difference
        const timeDiff = returned.getTime() - picked.getTime();
        const noOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        // Check if user proposed a different price
        const isBargained = proposedPricePerDay && Number(proposedPricePerDay) !== Number(carData.pricePerDay)
        const pricePerDay = isBargained ? Number(proposedPricePerDay) : Number(carData.pricePerDay)
        
        // Use Math.round to avoid floating point precision issues
        const price = Math.round(pricePerDay * noOfDays);
        const originalPrice = Math.round(Number(carData.pricePerDay) * noOfDays);

        console.log('Booking creation:', {
            receivedProposedPrice: proposedPricePerDay,
            typeOfProposed: typeof proposedPricePerDay,
            convertedProposed: Number(proposedPricePerDay),
            carPricePerDay: carData.pricePerDay,
            isBargained,
            noOfDays,
            pricePerDay,
            price,
            originalPrice
        })

        //create booking

        const newBooking = await Booking.create({ 
            car, 
            owner:carData.owner, 
            user: _id, 
            pickupDate,
            returnDate, 
            price,
            originalPrice,
            proposedPricePerDay: proposedPricePerDay ? Number(proposedPricePerDay) : null,
            isBargained,
            paymentMethod
        })
        
        const message = isBargained ? "Booking request sent with your proposed price" : "Booking Created"
        res.json({success:true, message, bookingId: newBooking._id})




         
        
    } catch (error) {

             console.log(error.message)
             res.json({success:false, message: error.message})
        
    }
}

// API to list USER  Bookings---------------------------------------------------------------------------------------------------------------------------------

export const getUserBookings  = async(req,res)=>{

    try {

        const {_id}=req.user;  
        const bookings= await Booking.find({user:_id})
          .populate('car')
          .populate('owner', '-password')
          .sort({createdAt:-1})
        res.json({success:true, bookings})

    } catch (error) {

          console.log(error.message)
          res.json({success:false, message: error.message})
        
    }
}

// API to get Owner Bookings----------------------------------------------------------------------------------------------------------------------------------------------

export const getOwnerBookings  = async(req,res)=>{

    try {

         if(req.user.role !== 'owner'){
            return res.json({success:false, message:"Unauthorizes"})
         }

         const bookings = await Booking.find({owner:req.user._id})
           .populate('car')
           .populate('user', '-password')
           .sort({createdAt:-1})
         res.json({success:true, bookings})


      

    } catch (error) {

          console.log(error.message)
          res.json({success:false, message: error.message})
        
    }
}

//API to change booking status----------------------------------------------------------------------------------------


export const changeBookingStatus  = async(req,res)=>{

    try {

     const {_id} = req.user;
     const {bookingId, status}=req.body;

     const booking = await Booking.findById(bookingId)

     if(booking.owner.toString() !== _id.toString()){
         return res.json({success:false, message:"Unauthorized"})

     }
      
     booking.status = status;
     await booking.save();

     // If booking is confirmed, only mark as unavailable if booking starts today or earlier
     if(status === 'confirmed'){
         const today = new Date();
         today.setHours(0, 0, 0, 0);
         const bookingStart = new Date(booking.pickupDate);
         bookingStart.setHours(0, 0, 0, 0);
         
         // Only set isAvailable to false if the booking has started
         const shouldBeUnavailable = bookingStart <= today;
         
         await Car.findByIdAndUpdate(booking.car, {
             isAvailable: !shouldBeUnavailable,
             bookedUntil: booking.returnDate
         })
         
         console.log(`Booking confirmed: Car ${shouldBeUnavailable ? 'is now' : 'will be'} unavailable from ${bookingStart.toDateString()}`);
     }

     // If booking is cancelled, set car as available again
     if(status === 'cancelled'){
         await Car.findByIdAndUpdate(booking.car, {
             isAvailable: true,
             bookedUntil: null
         })
     }

      res.json({success:true, message:"Status Updated"})



    } catch (error) {

          console.log(error.message)
          res.json({success:false, message: error.message})
        
    }
}

//API to cancel booking (for users)----------------------------------------------------------------------------------------

export const cancelBooking = async(req,res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, reason}=req.body;

        const booking = await Booking.findById(bookingId)

        if(!booking){
            return res.json({success:false, message:"Booking not found"})
        }

        // Check if booking belongs to user
        if(booking.user.toString() !== _id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }

        // Only allow cancellation if status is pending or confirmed
        if(booking.status === 'cancelled'){
            return res.json({success:false, message:"Booking is already cancelled"})
        }

        // Calculate cancellation fee based on policy
        const cancellationResult = calculateCancellationFee(booking)
        
        if(!cancellationResult.canCancel){
            return res.json({
                success:false, 
                message: cancellationResult.message
            })
        }

        // Update booking status to cancelled
        booking.status = 'cancelled'
        booking.cancellationFee = cancellationResult.fee
        booking.cancelledAt = new Date()
        booking.cancellationReason = reason || 'User cancelled'
        await booking.save()

        // Make car available again
        await Car.findByIdAndUpdate(booking.car, {
            isAvailable: true,
            bookedUntil: null
        })

        res.json({
            success:true, 
            message: cancellationResult.message,
            cancellationFee: cancellationResult.fee,
            refundAmount: cancellationResult.refundAmount
        })

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

// Helper function to calculate cancellation fee
const calculateCancellationFee = (booking) => {
    const now = new Date()
    const pickupDate = new Date(booking.pickupDate)
    
    // Calculate hours until pickup
    const hoursUntilPickup = (pickupDate - now) / (1000 * 60 * 60)
    const daysUntilPickup = hoursUntilPickup / 24
    
    console.log(`Cancellation check: ${daysUntilPickup.toFixed(1)} days until pickup`)
    
    let fee = 0
    let refundPercentage = 100
    let message = ""
    let canCancel = true
    
    // Cancellation Policy Rules
    if(booking.status === 'confirmed'){
        // For confirmed bookings - stricter policy
        if(daysUntilPickup < 1){
            // Less than 24 hours - No cancellation allowed
            canCancel = false
            message = "Cannot cancel within 24 hours of pickup. Please contact the owner directly."
        } else if(daysUntilPickup < 2){
            // 1-2 days before - 100% cancellation fee (no refund)
            fee = booking.price
            refundPercentage = 0
            message = "Cancellation fee: 100% (₹" + fee + "). Owner will receive full payment as compensation."
        } else if(daysUntilPickup < 3){
            // 2-3 days before - 75% cancellation fee
            fee = Math.round(booking.price * 0.75)
            refundPercentage = 25
            message = "Cancellation fee: 75% (₹" + fee + "). You'll be charged this amount."
        } else if(daysUntilPickup < 7){
            // 3-7 days before - 50% cancellation fee
            fee = Math.round(booking.price * 0.50)
            refundPercentage = 50
            message = "Cancellation fee: 50% (₹" + fee + "). You'll be charged this amount."
        } else {
            // 7+ days before - 25% cancellation fee
            fee = Math.round(booking.price * 0.25)
            refundPercentage = 75
            message = "Cancellation fee: 25% (₹" + fee + "). You'll be charged this amount."
        }
    } else if(booking.status === 'pending'){
        // For pending bookings - more lenient
        if(daysUntilPickup < 1){
            // Less than 24 hours
            fee = Math.round(booking.price * 0.50)
            refundPercentage = 50
            message = "Cancellation fee: 50% (₹" + fee + ") for late cancellation."
        } else if(daysUntilPickup < 3){
            // 1-3 days before
            fee = Math.round(booking.price * 0.25)
            refundPercentage = 75
            message = "Cancellation fee: 25% (₹" + fee + ")."
        } else {
            // 3+ days before - Free cancellation
            fee = 0
            refundPercentage = 100
            message = "Booking cancelled successfully. No cancellation fee."
        }
    }
    
    const refundAmount = booking.price - fee
    
    return {
        canCancel,
        fee,
        refundAmount,
        refundPercentage,
        message,
        daysUntilPickup: daysUntilPickup.toFixed(1)
    }
}

// New API to check cancellation policy before cancelling
export const checkCancellationPolicy = async(req,res)=>{
    try {
        const {_id} = req.user;
        const {bookingId}=req.body;

        const booking = await Booking.findById(bookingId)

        if(!booking){
            return res.json({success:false, message:"Booking not found"})
        }

        // Check if booking belongs to user
        if(booking.user.toString() !== _id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }

        if(booking.status === 'cancelled'){
            return res.json({success:false, message:"Booking is already cancelled"})
        }

        const cancellationResult = calculateCancellationFee(booking)
        
        res.json({
            success:true, 
            policy: cancellationResult
        })

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

//API for owner to send counter offer----------------------------------------------------------------------------------------

export const sendCounterOffer = async(req,res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, counterPricePerDay}=req.body;

        const booking = await Booking.findById(bookingId)

        if(!booking){
            return res.json({success:false, message:"Booking not found"})
        }

        // Check if booking belongs to owner
        if(booking.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }

        // Calculate new price based on counter offer
        const picked = new Date(booking.pickupDate);
        const returned = new Date(booking.returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000*60*60*24))
        const newPrice = counterPricePerDay * noOfDays;

        // Update booking with counter offer
        booking.counterPricePerDay = counterPricePerDay
        booking.hasCounterOffer = true
        booking.price = newPrice
        await booking.save()

        res.json({success:true, message:"Counter offer sent to customer"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

//API for user to accept counter offer----------------------------------------------------------------------------------------

export const acceptCounterOffer = async(req,res)=>{
    try {
        const {_id} = req.user;
        const {bookingId}=req.body;

        const booking = await Booking.findById(bookingId)

        if(!booking){
            return res.json({success:false, message:"Booking not found"})
        }

        // Check if booking belongs to user
        if(booking.user.toString() !== _id.toString()){
            return res.json({success:false, message:"Unauthorized"})
        }

        if(!booking.hasCounterOffer){
            return res.json({success:false, message:"No counter offer to accept"})
        }

        // Accept the counter offer - update the proposed price to counter price
        booking.proposedPricePerDay = booking.counterPricePerDay
        booking.hasCounterOffer = false // Counter offer accepted, no longer pending
        await booking.save()

        res.json({success:true, message:"Counter offer accepted! Waiting for owner confirmation"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

//API to get bookings for a specific car (public - no auth required)----------------------------------------------------------------------------------------

export const getCarBookings = async(req,res)=>{
    try {
        const {carId} = req.params;

        // Get all confirmed bookings for this car (future and current)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const bookings = await Booking.find({
            car: carId,
            status: {$in: ['pending', 'confirmed']},
            returnDate: {$gte: today} // Only show current and future bookings
        })
        .select('pickupDate returnDate status')
        .sort({pickupDate: 1});

        res.json({success:true, bookings})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}
