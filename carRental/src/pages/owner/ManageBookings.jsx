import { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

 const {currency, axios, isOwner}= useAppContext()

  const [bookings, setBookings]=useState([])
  const [showCounterModal, setShowCounterModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [counterPrice, setCounterPrice] = useState('')

  // Fetch all the bookings----------------------------------------------------------------------------------------------------

  const fetchOwnerBookings = async ()=>{
    try {
      
        const {data}= await axios.get('/api/bookings/owner')
        data.success ? setBookings(data.bookings): toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

// change booking status-----------------------------------------------------------------------------------------------
    const changeBookingStatus = async (bookingId,status)=>{
    try {
      
        const {data}= await axios.post('/api/bookings/change-status',{bookingId,status})
        if(data.success){
          toast.success(data.message)
          fetchOwnerBookings()
        }else{
          toast.error(data.message)
        }
       
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Handle counter offer
  const handleCounterOffer = (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId)
    setSelectedBooking(booking)
    setCounterPrice('')
    setShowCounterModal(true)
  }

  // Submit counter offer
  const submitCounterOffer = async () => {
    if(!counterPrice || counterPrice <= 0){
      toast.error('Please enter a valid price')
      return
    }

    try {
      const {data} = await axios.post('/api/bookings/counter-offer', {
        bookingId: selectedBooking._id,
        counterPricePerDay: Number(counterPrice)
      })

      if(data.success){
        toast.success(data.message)
        setShowCounterModal(false)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(isOwner){
      fetchOwnerBookings()
    }
  },[isOwner])
  return (
   <div className='px-4 pt-10 md:px-10 w-full'>

       {/* Counter Offer Modal */}
       {showCounterModal && selectedBooking && (
         <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50' onClick={() => setShowCounterModal(false)}>
           <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4' onClick={(e) => e.stopPropagation()}>
             <h3 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>Counter Offer</h3>
             
             <div className='space-y-3 mb-4'>
               <div className='flex justify-between text-sm'>
                 <span className='text-gray-600'>Original Price:</span>
                 <span className='font-semibold'>{currency}{Math.round(selectedBooking.originalPrice / Math.ceil((new Date(selectedBooking.returnDate) - new Date(selectedBooking.pickupDate)) / (1000*60*60*24)))}/day</span>
               </div>
               <div className='flex justify-between text-sm'>
                 <span className='text-gray-600'>User Proposed:</span>
                 <span className='font-semibold text-blue-600'>{currency}{selectedBooking.proposedPricePerDay}/day</span>
               </div>
             </div>

             <div className='mb-4'>
               <label className='block text-sm text-gray-600 dark:text-gray-400 mb-2'>Your Counter Offer (per day)</label>
               <div className='flex items-center gap-2'>
                 <span className='text-gray-600 dark:text-gray-400'>{currency}</span>
                 <input
                   type='number'
                   value={counterPrice}
                   onChange={(e) => setCounterPrice(e.target.value)}
                   placeholder='Enter your price'
                   className='flex-1 px-3 py-2 border border-borderColor dark:border-gray-600 rounded-lg outline-none bg-white dark:bg-gray-700 dark:text-white'
                 />
               </div>
             </div>

             <div className='flex gap-3'>
               <button
                 onClick={() => setShowCounterModal(false)}
                 className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
               >
                 Cancel
               </button>
               <button
                 onClick={submitCounterOffer}
                 className='flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors'
               >
                 Send Offer
               </button>
             </div>
           </div>
         </div>
       )}

       <Title title='Manage Bookings' subTitle='Track all customer bookings, approve or cancel requests, and manage booking statuses' />

       <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
         
            <table className='w-full border-collapse text-left text-sm text-gray-600'>
                <thead className='text-gray-600'>
                     <tr>
                            <th className='p-3 font-medium'>Car</th>
                             <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                              <th className='p-3 font-medium'>Total</th>
                               <th className='p-3 font-medium max-md:hidden'>Payment</th>
                                <th className='p-3 font-medium'>Actions</th>
                     </tr>
                </thead>

                <tbody>
                  {
                    bookings.map((booking,index)=>{
                      // Safety check: skip if car data is missing
                      if(!booking.car) {
                        console.warn('Booking missing car data:', booking)
                        return null
                      }
                      
                      return (
                      <tr key={index} className='border-t border-borderColor text-gray-500'>

                        {/* --------------first col -----------------------*/}
                          
                          <td className='p-3'>
                            <div className='flex items-start gap-3'>
                              <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover flex-shrink-0' />
                              <div className='flex-1 min-w-0'>
                                <p className='font-medium text-gray-800'>{booking.car.brand} {booking.car.model}</p>
                                
                                {/* Mobile: Show date range */}
                                <p className='text-xs text-gray-600 mt-1 md:hidden'>
                                  {new Date(booking.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                
                                <div className='flex flex-wrap gap-1 mt-1'>
                                  {booking.isBargained && !booking.hasCounterOffer && (
                                    <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full'>
                                      Bargained
                                    </span>
                                  )}
                                  {booking.hasCounterOffer && (
                                    <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full'>
                                      Counter Sent
                                    </span>
                                  )}
                                  {booking.isBargained && !booking.hasCounterOffer && booking.counterPricePerDay && (
                                    <span className='text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>
                                      ✓ Accepted
                                    </span>
                                  )}
                                  {/* Mobile: Show payment method */}
                                  <span className='md:hidden text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full'>
                                    {booking.paymentMethod}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/*-------------- Second col-----------------------*/}
                          <td className='p-3 max-md:hidden'>
                            <div>
                              <p>{booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}</p>
                              {booking.status === 'confirmed' && booking.user && (
                                <div className='mt-2 text-xs bg-blue-50 p-2 rounded space-y-1'>
                                  <p className='font-semibold text-blue-800'>Customer:</p>
                                  <p className='text-gray-700'>{booking.user.name}</p>
                                  <p className='text-gray-600'>{booking.user.email}</p>
                                  {booking.user.phone && (
                                    <p className='text-gray-600'>📱 {booking.user.phone}</p>
                                  )}
                                </div>
                              )}
                            </div>
 
                          </td>
                         

                          {/* --------------Third col -----------------------*/}

                          <td className='p-3'>
                            <div>
                              {booking.isBargained && (
                                <div className='mb-2 p-2 bg-yellow-50 rounded text-xs'>
                                  <p className='line-through text-gray-500'>{currency}{booking.originalPrice} total</p>
                                  <p className='font-semibold text-blue-600'>User offered: {currency}{booking.proposedPricePerDay}/day</p>
                                </div>
                              )}
                              <p className={`font-semibold ${booking.isBargained ? 'text-green-600' : 'text-gray-800'}`}>
                                {currency}{booking.price} <span className='text-xs text-gray-500 font-normal'>total</span>
                              </p>
                              {booking.isBargained && !booking.hasCounterOffer && booking.counterPricePerDay && (
                                <p className='text-xs font-semibold mt-1 text-green-600'>
                                  ✓ User accepted your offer
                                </p>
                              )}
                              
                              {/* Mobile: Show customer info for confirmed bookings */}
                              {booking.status === 'confirmed' && booking.user && (
                                <div className='mt-2 text-xs bg-blue-50 p-2 rounded space-y-1 md:hidden'>
                                  <p className='font-semibold text-blue-800'>Customer:</p>
                                  <p className='text-gray-700'>{booking.user.name}</p>
                                  <p className='text-gray-600'>{booking.user.email}</p>
                                  {booking.user.phone && (
                                    <p className='text-gray-600'>📱 {booking.user.phone}</p>
                                  )}
                                </div>
                              )}
                            </div>
 
                          </td>
                         

                          {/* --------------fourth col----------------------- */}
                          <td className='p-3 max-md:hidden'>

                            <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>
                              offline
                            </span>

                          </td>
                        

                           {/*-------------- fifth col----------------------- */}

                           <td className='p-3'>
                            {booking.status=== 'pending' ?(
                              <div className='flex flex-col gap-2'>
                                <select onChange={e=> changeBookingStatus(booking._id,e.target.value)} value={booking.status}  className='px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none bg-white cursor-pointer'>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="confirmed">Confirmed</option>
                                </select>
                                
                                {(booking.isBargained || booking.proposedPricePerDay) && !booking.counterPricePerDay && (
                                  <button
                                    onClick={() => handleCounterOffer(booking._id)}
                                    className='px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold'
                                  >
                                    💰 Counter Offer
                                  </button>
                                )}
                                
                                {booking.hasCounterOffer && (
                                  <p className='text-xs text-orange-600 font-semibold'>
                                    ⏳ Waiting for user...
                                  </p>
                                )}
                                
                                {(booking.isBargained || booking.proposedPricePerDay) && !booking.hasCounterOffer && booking.counterPricePerDay && (
                                  <p className='text-xs text-green-600 font-semibold'>
                                    ✓ Ready to confirm!
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                 {booking.status}
                              </span>
                            )}

                           </td>
                           


                      </tr>
                    )})
                  }
                </tbody>

            </table>

       </div>
    </div>
  )
}

export default ManageBookings