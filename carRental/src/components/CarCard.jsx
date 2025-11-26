import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {

    const currency=import.meta.env.VITE_CURRENCY
    const navigate=useNavigate();

  return (
    // when we click any card it gives us id and redirects to the car-details path
    <motion.div 
      onClick={()=>{navigate(`/car-details/${car._id}`); scrollTo(0,0) }} 
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className='group rounded-xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer'
    > 

       <div className='relative h-48 overflow-hidden'>
         <img src={car.image} alt="Car Image" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!car.isAvailable && !car.futureBooking && 'opacity-60'}`} />

         {car.futureBooking ? (
           <p className='absolute top-4 left-4 bg-green-500/90 text-white text-xs px-2.5 py-1 rounded-full'>Available for Future</p>
         ) : car.isAvailable ? (
           <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>
         ) : (
           <p className='absolute top-4 left-4 bg-red-500/90 text-white text-xs px-2.5 py-1 rounded-full'>Unavailable</p>
         )}
         
         {!car.isAvailable && !car.futureBooking && (
           <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4'>
             <p className='text-white text-lg font-semibold'>Currently Booked</p>
             {car.bookedUntil && (
               <p className='text-white text-sm mt-2'>
                 Until: {new Date(car.bookedUntil).toLocaleDateString()}
               </p>
             )}
           </div>
         )}

           
           <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                <span  className='font-semibold'>{currency}{car.pricePerDay}</span>
                <span className='text-sm text-white/80'> / day</span>
          </div>

       </div>

       <div className='p-4 sm:p-4'>
          <div className='flex justify-between items-start mb-2'>
              <div>
                <h3 className='text-lg font-medium'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-sm'>{car.category}•{car.year}</p>
              </div>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
               <div className='flex items-center text-sm text-muted-foreground'>
                   <img src={assets.users_icon} alt="" className='h-4 mr-2' />
                   <span>{car.seating_capacity} Seats</span>
               </div>

                 <div className='flex items-center text-sm text-muted-foreground'>
                   <img src={assets.fuel_icon} alt="" className='h-4 mr-2' />
                   <span>{car.fuel_type}</span>
               </div>

               <div className='flex items-center text-sm text-muted-foreground'>
                   <img src={assets.car_icon} alt="" className='h-4 mr-2' />
                   <span>{car.transmission}</span>
               </div>

                <div className='flex items-center text-sm text-muted-foreground'>
                   <img src={assets.location_icon} alt="" className='h-4 mr-2' />
                   <span>{car.location}</span>
               </div>

              
          </div>

       </div>
       
       </motion.div>
  )
}

export default CarCard