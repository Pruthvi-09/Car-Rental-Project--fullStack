import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import BookingCalendar from '../components/BookingCalendar'
import { AppContext, useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const CarDetails = () => {

  const {id}=useParams()
  const {cars, axios,pickupDate, setPickupDate, returnDate, setReturnDate, fetchCars, user, setShowLogin}= useAppContext()
  const navigate=useNavigate()
  const [car,setCar]=useState(null)// for storing the car details
  const [paymentMethod, setPaymentMethod] = useState('offline') // Default to offline since online is unavailable
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBargain, setShowBargain] = useState(false)
  const [proposedPrice, setProposedPrice] = useState('')
  const currency=import.meta.env.VITE_CURRENCY

  // handle Submit form for book car

  const handleSubmit = async (e)=>{
    e.preventDefault()
    
    // Check if user is logged in
    if(!user){
      toast.error('Please login to book a car')
      setShowLogin(true)
      return
    }
    
    // Validate payment method
    if(paymentMethod === 'online'){
      toast.error('Online payment is currently unavailable. Please select "Pay at Pickup"')
      return
    }
    
    // Validate dates
    if(!pickupDate || !returnDate){
      toast.error('Please select pickup and return dates')
      return
    }

    if(new Date(returnDate) <= new Date(pickupDate)){
      toast.error('Return date must be after pickup date')
      return
    }
    
    try {

     const {data}= await axios.post('/api/bookings/create',{
        car:id,
        pickupDate,
        returnDate,
        paymentMethod,
        proposedPricePerDay: proposedPrice ? Number(proposedPrice) : null
      })

      if(data.success){
        toast.success(data.message)
        // Refresh car data before navigating
        await fetchCars()
        navigate('/my-bookings')
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(cars.length > 0){
      const foundCar = cars.find(car=> car._id === id)
      setCar(foundCar)
    }
  },[id, cars])

  return  car ? (        //it means if the car data is available then information will be return
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
            
            {/* -------------Back Button--------------- */}
            <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
              <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65' />
              Back to all cars
            </button>

             {/* -------------Details Cars--------------- */}

               <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
                  {/* Left:Car Image and Details */}
                  <div className='lg:col-span-2'>   {/*//out of 3 columns it takes two */}
                    {/* car image gallery */}
                    <div className='mb-6'>
                      {/* Main Image */}
                      <div className='relative rounded-xl overflow-hidden shadow-md mb-4'>
                        <img 
                          src={car.images && car.images.length > 0 ? car.images[currentImageIndex] : car.image} 
                          alt="Car" 
                          className='w-full h-auto md:max-h-[500px] object-cover' 
                        />
                        
                        {/* Navigation Arrows - only show if multiple images */}
                        {car.images && car.images.length > 1 && (
                          <>
                            <button 
                              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length)}
                              className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all'
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % car.images.length)}
                              className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all'
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              </button>
                            
                            {/* Image Counter */}
                            <div className='absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm'>
                              {currentImageIndex + 1} / {car.images.length}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Thumbnail Gallery */}
                      {car.images && car.images.length > 1 && (
                        <div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
                          {car.images.map((img, index) => (
                            <div 
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-gray-300'
                              }`}
                            >
                              <img 
                                src={img} 
                                alt={`Thumbnail ${index + 1}`} 
                                className='w-full h-20 object-cover'
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                     <div className='space-y-6'>
                        <div>
                          <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
                          <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
                        </div>

                        <hr className='border-borderColor my-6'/>

            {/* ------------- Cars specified grid--------------- */}
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                           {
                            [
                              {icon:assets.users_icon, text:`${car.seating_capacity} Seats`},
                              {icon:assets.fuel_icon, text: car.fuel_type},
                              {icon:assets.car_icon, text: car.transmission},
                              {icon:assets.location_icon, text: car.location}

                            ].map(({icon,text})=>(

                              <div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                                <img src={icon} alt="" className='h-5 mb-2'/>
                                {text}
                              </div>

                            ))
                           }
                        </div>

                        {/* Mileage Display */}
                        {car.mileage && (
                          <div className='flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                            <span className='text-2xl'>⛽</span>
                            <div>
                              <p className='text-sm text-gray-500 dark:text-gray-400'>Fuel Efficiency</p>
                              <p className='text-lg font-semibold text-green-700 dark:text-green-400'>{car.mileage} km/l</p>
                            </div>
                          </div>
                        )}
            {/* ------------- Cars Description--------------- */}
            <div>
              <h1 className='text-xl font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{car.description}</p>
            </div>

             {/* ------------- Cars Features--------------- */}
             <div>
                <h1 className='text-xl font-medium mb-3'>Features</h1>
                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {
                    ["360 Camera","Bluetooth","GPS","Heated Seates","Rear View "
                    ," Mirror"].map((item)=>(
                      <li key={item} className='flex items-center text-gray-500'>
                           <img src={assets.check_icon} className='h-4 mr-2' alt="" />{item}
                      </li>
                    ))
                  }


                </ul>

             </div>

             {/* Booking Calendar */}
             <div className='mt-8'>
               <BookingCalendar carId={id} axios={axios} />
             </div>

             </div>

                  </div>

                    {/* Right:Booking Form */}
                   <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-10 rounded-xl p-6 space-y-6 text-gray-500'>


                      <div>
                        <p className='flex items-center justify-between text-2xl font-semibold'>
                          <span style={{color: '#000000'}}>{currency}{car.pricePerDay}</span>
                          <span className='text-base text-gray-400 dark:text-gray-500 font-normal'>per day</span>
                        </p>
                        
                        {/* Bargain Toggle */}
                        <button 
                          type='button'
                          onClick={() => setShowBargain(!showBargain)}
                          className='text-sm text-primary hover:underline mt-2'
                        >
                          {showBargain ? '✕ Cancel bargain' : '💰 Propose your price'}
                        </button>
                        
                        {/* Bargain Input */}
                        {showBargain && (
                          <div className='mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                            <label className='text-sm text-gray-600 dark:text-gray-400'>Your proposed price per day</label>
                            <div className='flex items-center gap-2 mt-2'>
                              <span className='text-gray-600 dark:text-gray-400'>{currency}</span>
                              <input 
                                type='number'
                                value={proposedPrice}
                                onChange={(e) => setProposedPrice(e.target.value)}
                                placeholder={car.pricePerDay}
                                min="1"
                                step="1"
                                className='flex-1 px-3 py-2 border border-borderColor dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-gray-800 dark:text-white'
                              />
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                              Owner will review your proposal
                            </p>
                          </div>
                        )}
                      </div>

                      <hr  className='border-borderColor dark:border-gray-700 my-6'/>

                      <div className='flex flex-col gap-2'>
                        <label htmlFor="pickup-date"  >Pickup Date</label>
                        <input value={pickupDate}  onChange={(e)=>setPickupDate(e.target.value)}
                        type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
                      </div>

                       <div className='flex flex-col gap-2'>
                        <label htmlFor="return-date"  >Return Date</label>
                        <input 
                        value={returnDate}  onChange={(e)=>setReturnDate(e.target.value)}
                        type="date" className='border border-borderColor px-3 py-2 rounded-lg' required id='return-date'/>
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='font-medium text-gray-800'>Payment Method</label>
                        <div className='flex flex-col gap-3'>
                          <label className='flex items-center gap-2 cursor-not-allowed opacity-50'>
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              value="online"
                              checked={paymentMethod === 'online'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              disabled
                              className='w-4 h-4 accent-primary'
                            />
                            <span className='flex items-center gap-2'>
                              Online Payment
                              <span className='text-xs text-red-500'>(Currently Unavailable)</span>
                            </span>
                          </label>
                          <label className='flex items-center gap-2 cursor-pointer'>
                            <input 
                              type="radio" 
                              name="paymentMethod" 
                              value="offline"
                              checked={paymentMethod === 'offline'}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className='w-4 h-4 accent-primary'
                            />
                            <span>Pay at Pickup</span>
                          </label>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className='w-full py-2 sm:py-3 font-medium text-white rounded-xl transition-all bg-primary hover:bg-primary-dull cursor-pointer text-xs sm:text-base'
                      >
                        Book Now
                      </button>
                      
                      <p className='text-xs text-gray-500 text-center'>
                        💡 Check the booking schedule below to see available dates
                      </p>

                      <p className='text-center text-sm'>{paymentMethod === 'online' ? 'Secure online payment' : 'Pay when you pick up the car'}</p>

                    </form>

                 </div>


    </div>
  ): <Loader/>
}

export default CarDetails