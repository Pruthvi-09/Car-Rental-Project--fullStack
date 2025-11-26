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
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center '>
        {/* heading */}
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-4xl md:text-5xl font-semibold '
        >
          Luxury cars on Rent
        </motion.h1>
        {/* Forms */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch} 
          className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-[20rem] md:max-w-[45rem] bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'
        >
               
               {/*------------- Choose location code --------------------*/}
               <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>
                       <div className='flex flex-col items-start gap-2'>
                        <select required value={pickupLocation} onChange={(e)=> setPickupLocation(e.target.value)} className='px-3 py-2 border border-gray-200 rounded-md outline-none bg-white cursor-pointer'>
                              <option value="">Pickup Location</option>
                              {cityList.map((city)=> <option key={city} value={city}>{city}</option>)}
                        </select>
                        <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation: 'please select location'}</p>
                       </div>

                          {/*-------------- pickup date------------------ */}
                        <div className='flex flex-col items-start gap-2'>                    
                          <label htmlFor="pickup-date">Pick-up</label>
                          <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)}  type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500'  required/>                 
                       </div>
                          {/*--------------return  date------------------ */}

                        <div className='flex flex-col items-start gap-2'>                    
                          <label htmlFor="return-date">Return</label>
                          <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" id='return-date' min={pickupDate || new Date().toISOString().split('T')[0]} className='text-sm text-gray-500'  required/>                 
                       </div>

                      
               </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer transition-colors'
                >
                  <img src={assets.search_icon} alt="Search" className='brightness-300' />
                  search
                </motion.button>

        </motion.form>
        {/* Car Image */}
        <motion.img 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          src={assets.main_car} 
          alt="car"  
          className='max-h-74'
        /> 

    </div>
  )
}

export default Hero