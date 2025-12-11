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

  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null)
  const [cancellationPolicy, setCancellationPolicy] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')

  const checkCancellationPolicy = async (bookingId) => {
    try {
      const {data} = await axios.post('/api/bookings/check-cancellation-policy', {bookingId})
      
      if(data.success){
        return data.policy
      } else {
        toast.error(data.message)
        return null
      }
    } catch (error) {
      toast.error(error.message)
      return null
    }
  }

  const handleCancelClick = async (booking) => {
    const policy = await checkCancellationPolicy(booking._id)
    
    if(!policy) return
    
    if(!policy.canCancel){
      toast.error(policy.message)
      return
    }
    
    setSelectedBookingForCancel(booking)
    setCancellationPolicy(policy)
    setShowCancelModal(true)
  }

  const confirmCancellation = async () => {
    if(!selectedBookingForCancel) return

    try {
      const {data} = await axios.post('/api/bookings/cancel', {
        bookingId: selectedBookingForCancel._id,
        reason: cancellationReason
      })
      
      if(data.success){
        toast.success(data.message)
        setShowCancelModal(false)
        setSelectedBookingForCancel(null)
        setCancellationPolicy(null)
        setCancellationReason('')
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

        {/* Cancellation Policy Modal */}
        {showCancelModal && selectedBookingForCancel && cancellationPolicy && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowCancelModal(false)}>
            <div className='bg-white rounded-lg p-6 max-w-md w-full shadow-2xl' onClick={(e) => e.stopPropagation()}>
              <h3 className='text-xl font-semibold mb-4' style={{color: '#000000'}}>⚠️ Cancellation Policy</h3>
              
              <div className='space-y-4 mb-6'>
                <div className='bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300'>
                  <p className='text-sm mb-3' style={{color: '#000000'}}>{cancellationPolicy.message}</p>
                  
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span style={{color: '#666666'}}>Booking Amount:</span>
                      <span className='font-semibold' style={{color: '#000000'}}>{currency}{selectedBookingForCancel.price}</span>
                    </div>
                    
                    {cancellationPolicy.fee > 0 && (
                      <>
                        <div className='flex justify-between text-red-600'>
                          <span>Cancellation Fee:</span>
                          <span className='font-semibold'>- {currency}{cancellationPolicy.fee}</span>
                        </div>
                        <div className='flex justify-between text-green-600 pt-2 border-t-2 border-gray-300'>
                          <span>Refund Amount:</span>
                          <span className='font-semibold'>{currency}{cancellationPolicy.refundAmount}</span>
                        </div>
                      </>
                    )}
                    
                    {cancellationPolicy.fee === 0 && (
                      <div className='flex justify-between text-green-600 pt-2 border-t-2 border-gray-300'>
                        <span>Full Refund:</span>
                        <span className='font-semibold'>{currency}{selectedBookingForCancel.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className='text-xs mt-3' style={{color: '#666666'}}>
                    📅 {cancellationPolicy.daysUntilPickup} days until pickup
                  </p>
                </div>

                <div>
                  <label className='block text-sm mb-2' style={{color: '#666666'}}>Reason for cancellation (optional)</label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder='Let the owner know why you are cancelling...'
                    className='w-full px-3 py-2 border-2 border-gray-300 rounded-lg outline-none bg-white resize-none'
                    style={{color: '#000000'}}
                    rows={3}
                  />
                </div>
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedBookingForCancel(null)
                    setCancellationPolicy(null)
                    setCancellationReason('')
                  }}
                  className='flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'
                  style={{color: '#000000'}}
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancellation}
                  className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold'
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

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
                     
                     {booking.status === 'cancelled' && booking.cancellationFee > 0 && (
                       <div className='mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs'>
                         <p className='text-red-600 dark:text-red-400'>Cancellation Fee: {currency}{booking.cancellationFee}</p>
                         {booking.cancelledAt && (
                           <p className='text-gray-500 dark:text-gray-400 mt-1'>
                             Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
                           </p>
                         )}
                       </div>
                     )}
                   </div>

                   {(booking.status === 'pending' || booking.status === 'confirmed') && (
                     <button 
                       onClick={() => handleCancelClick(booking)}
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