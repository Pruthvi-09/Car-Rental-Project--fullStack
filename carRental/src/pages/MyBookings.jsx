import { useEffect, useState } from 'react'
import{ assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MyBookings = () => {

  const {axios,user, currency } = useAppContext()

  const [bookings,setBookings]=useState([])

  const fetchMyBookings =async ()=>{
   try {
    const {data}= await axios.get('/api/bookings/user')

    if(data.success){
      setBookings(data.bookings)
    }else{
      toast.error(data.message)
    }
    
   } catch (error) {
     console.error('Fetch bookings error:', error)
     toast.error(error.message)
   }
  }

  const cancelBooking = async (bookingId) => {
    if(!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      const {data} = await axios.post('/api/bookings/cancel', {bookingId})
      
      if(data.success){
        toast.success(data.message)
        fetchMyBookings() // Refresh bookings
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Accept counter offer
  const acceptCounterOffer = async (bookingId) => {
    try {
      const {data} = await axios.post('/api/bookings/accept-counter', {bookingId})
      
      if(data.success){
        toast.success(data.message)
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Reject counter offer
  const rejectCounterOffer = async (bookingId) => {
    if(!window.confirm('Are you sure you want to reject this counter offer? The booking will be cancelled.')) return

    try {
      const {data} = await axios.post('/api/bookings/cancel', {bookingId})
      
      if(data.success){
        toast.success('Counter offer rejected and booking cancelled')
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
   if(user){
     fetchMyBookings()
   }
  },[user])
  
  return (
  <div className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl w-full mx-auto'>

        <Title title='My Bookings'
        subTitle='View and manage your all car bookings'
        align="left"
        />

        <div>
          {bookings.length === 0 ? (
            <div className='text-center py-20 text-gray-500'>
              <p className='text-xl'>No bookings yet</p>
              <p className='mt-2'>Book a car to see your bookings here</p>
            </div>
          ) : (
            bookings.map((booking,index)=>{
              // Safety check: skip if car data is missing
              if(!booking.car) {
                console.warn('Booking missing car data:', booking)
                return null
              }
              
              return (
              <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
                 {/* ---------Car img + info -------------*/}
                          <div className='md:col-span-1'>
                            <div className='rounded-md overflow-hidden mb-3'>
                                   <img src={booking.car.image} alt=" " className='w-full h-auto aspect-video object-cover' />
                            </div>
                                 <p className='text-lg font-m mt-2'>{booking.car.brand} {booking.car.model}</p>
                                 <p className='text-gray-500'>{booking.car.year} • {booking.car.category} •{booking.car.location}</p>
                          </div>

                   {/* ---------Booking -------------*/}
                   <div className='md:col-span-2'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='px-3 py-1.5 bg-light rounded'>Booking #{index+1}</p>
                      <p className={` px-3 py-1 text-xs rounded-full ${booking.status==='confirmed' ? 'bg-green-400/15 text-green-600 ': 'bg-red-400/15 text-red-600'}`}>{booking.status}</p>
                      {booking.hasCounterOffer && (
                        <p className='px-3 py-1 text-xs rounded-full bg-blue-400/15 text-blue-600'>
                          Counter Offer Received
                        </p>
                      )}
                    </div>

                    {/* Show counter offer details */}
                    {booking.hasCounterOffer && booking.status === 'pending' && (
                      <div className='mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Owner's Counter Offer:</p>
                        <div className='flex items-center gap-4 text-sm mb-3'>
                          <div>
                            <span className='text-gray-500 dark:text-gray-400'>Your offer: </span>
                            <span className='line-through text-gray-400'>{currency}{booking.proposedPricePerDay}/day</span>
                          </div>
                          <div>
                            <span className='text-gray-500 dark:text-gray-400'>Owner's offer: </span>
                            <span className='font-semibold text-blue-600'>{currency}{booking.counterPricePerDay}/day</span>
                          </div>
                        </div>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => acceptCounterOffer(booking._id)}
                            className='flex-1 px-2 sm:px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm rounded transition-colors'
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => rejectCounterOffer(booking._id)}
                            className='flex-1 px-2 sm:px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded transition-colors'
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    )}


                    <div className='flex items-start gap-2 mt-3'>
                      <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                       <div>
                        <p className='text-gray-500'>Rental Period</p>
                        <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                       </div>
                    </div>


                     <div className='flex items-start gap-2 mt-3'>
                      <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                       <div>
                        <p className='text-gray-500'>Pick-up Location</p>
                        <p>{booking.car.location}</p>
                       </div>
                    </div>

                    <div className='flex items-start gap-2 mt-3'>
                      <img src={assets.cautionIconColored} alt="" className='w-4 h-4 mt-1' />
                       <div>
                        <p className='text-gray-500'>Payment Method</p>
                        <p className='font-medium'>{booking.paymentMethod === 'online' ? 'Online Payment' : 'Pay at Pickup'}</p>
                        <p className={`text-xs mt-1 ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                          {booking.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                        </p>
                       </div>
                    </div>

                   </div>

                   {/* Owner Contact Info - Show when confirmed */}
                   {booking.status === 'confirmed' && booking.owner && (
                     <div className='md:col-span-3 mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                       <p className='text-sm font-semibold mb-2' style={{color: '#166534'}}>📞 Owner Contact Information</p>
                       <div className='text-sm space-y-1'>
                         <p style={{color: '#374151'}}><span className='font-medium'>Name:</span> {booking.owner.name}</p>
                         <p style={{color: '#374151'}}><span className='font-medium'>Email:</span> {booking.owner.email}</p>
                         {booking.owner.phone && (
                           <p style={{color: '#374151'}}><span className='font-medium'>Phone:</span> {booking.owner.phone}</p>
                         )}
                         <p className='text-xs mt-2' style={{color: '#6B7280'}}>Contact the owner for pickup details and arrangements</p>
                       </div>
                     </div>
                   )}
                {/* --------- Price -------------*/}

                <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                   <div className='text-sm text-gray-500 text-right'>
                     <p>Total Price</p>
                     <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
                     <p>Booked on {booking.createdAt.split('T')[0]}</p>
                   </div>

                   {booking.status === 'pending' && (
                     <button 
                       onClick={() => cancelBooking(booking._id)}
                       className='px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm transition-all'
                     >
                       Cancel Booking
                     </button>
                   )}
                </div>


              </div>
            )})
          )}
        </div>
 
    </div>
  )
}

export default MyBookings