import { useState } from 'react'
import { motion } from 'framer-motion'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Hero = () => {

    const [pickupLocation , setPickupLocation]=useState('')

    const {pickupDate, setPickupDate, navigate,returnDate, setReturnDate}= useAppContext()

    const handleSearch = (e)=>{
      e.preventDefault()
      
      console.log('🔍 Form submitted with:', {pickupLocation, pickupDate, returnDate})
      
      // Validation
      if(!pickupLocation || !pickupDate || !returnDate){
        alert('Please fill all fields')
        return
      }
      
      if(new Date(returnDate) < new Date(pickupDate)){
        alert('Return date must be after pickup date')
        return
      }
      
      navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`)
    }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-8 md:gap-14 bg-light text-center px-4 py-8'>
        {/* heading */}
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-3xl sm:text-4xl md:text-5xl font-semibold mt-16 md:mt-0'
        >
          Luxury cars on Rent
        </motion.h1>
        {/* Forms */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch} 
          className='flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 sm:p-6 rounded-lg md:rounded-full w-full max-w-[95%] sm:max-w-[20rem] md:max-w-[45rem] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
        >
               
               {/*------------- Choose location code --------------------*/}
               <div className='flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-10 w-full md:w-auto'>
                       <div className='flex flex-col items-start gap-2 w-full md:w-auto'>
                        <label className='text-sm font-medium text-gray-700'>Location</label>
                        <select required value={pickupLocation} onChange={(e)=> setPickupLocation(e.target.value)} className='w-full px-3 py-2 border border-gray-200 rounded-md outline-none bg-white cursor-pointer text-sm'>
                              <option value="">Select Location</option>
                              {cityList.map((city)=> <option key={city} value={city}>{city}</option>)}
                        </select>
                       </div>

                          {/*-------------- pickup date------------------ */}
                        <div className='flex flex-col items-start gap-2 w-full md:w-auto'>                    
                          <label htmlFor="pickup-date" className='text-sm font-medium text-gray-700'>Pick-up</label>
                          <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)}  type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700'  required/>                 
                       </div>
                          {/*--------------return  date------------------ */}

                        <div className='flex flex-col items-start gap-2 w-full md:w-auto'>                    
                          <label htmlFor="return-date" className='text-sm font-medium text-gray-700'>Return</label>
                          <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id='return-date' min={pickupDate || new Date().toISOString().split('T')[0]} className='w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700'  required/>                 
                       </div>

                      
               </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 mt-4 md:mt-0 md:ml-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer transition-colors w-full md:w-auto text-xs sm:text-base'
                >
                  <img src={assets.search_icon} alt="Search" className='brightness-300 w-4 h-4' />
                  <span className='font-medium'>Search</span>
                </motion.button>

        </motion.form>
        {/* Car Image */}
        <motion.img 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          src={assets.main_car} 
          alt="car"  
          className='w-full max-w-md md:max-w-2xl h-auto object-contain'
        /> 

    </div>
  )
}

export default Hero