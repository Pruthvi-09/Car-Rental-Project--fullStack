import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BookingCalendar = ({ carId, axios }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`/api/bookings/car/${carId}`)
        if (data.success) {
          setBookings(data.bookings)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (carId) {
      fetchBookings()
    }
  }, [carId, axios])

  if (loading) {
    return (
      <div className='bg-light p-6 rounded-xl'>
        <h3 className='text-xl font-semibold mb-4'>Booking Schedule</h3>
        <div className='animate-pulse space-y-3'>
          <div className='h-16 bg-gray-200 rounded'></div>
          <div className='h-16 bg-gray-200 rounded'></div>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-green-50 p-6 rounded-xl border border-green-200'
      >
        <h3 className='text-xl font-semibold mb-2 text-green-800'>✓ Fully Available</h3>
        <p className='text-green-600'>This car has no upcoming bookings. Book anytime!</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-light p-6 rounded-xl'
    >
      <h3 className='text-xl font-semibold mb-4'>📅 Booking Schedule</h3>
      <p className='text-sm text-gray-500 mb-4'>
        This car is booked for the following dates. Choose different dates to book.
      </p>
      
      <div className='space-y-3'>
        {bookings.map((booking, index) => {
          const pickupDate = new Date(booking.pickupDate)
          const returnDate = new Date(booking.returnDate)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const isActive = pickupDate <= today && returnDate >= today
          const isPending = booking.status === 'pending'
          
          return (
            <motion.div
              key={booking._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                isActive 
                  ? 'bg-red-50 border-red-300' 
                  : isPending
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-2xl'>
                      {isActive ? '🚗' : isPending ? '⏳' : '📅'}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isActive 
                        ? 'bg-red-200 text-red-800' 
                        : isPending
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {isActive ? 'Currently Booked' : isPending ? 'Pending' : 'Confirmed'}
                    </span>
                  </div>
                  
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-sm'>
                      <span className='font-medium text-gray-700'>From:</span>
                      <span className='text-gray-600'>
                        {pickupDate.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <span className='font-medium text-gray-700'>To:</span>
                      <span className='text-gray-600'>
                        {returnDate.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className='text-xs text-gray-500 mt-2'>
                      {Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      

    </motion.div>
  )
}

export default BookingCalendar
