// import { useEffect, useState } from 'react'
// import Title from '../components/Title'
// import {assets} from '../assets/assets'
// import CarCard from '../components/CarCard'
// import { useSearchParams } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast'

// const Cars = () => {

//   // getting search params from urls
//   const [searchParams]= useSearchParams()
//   const pickupLocation= searchParams.get('pickupLocation')
//   const pickupDate= searchParams.get('pickupDate')
//   const returnDate= searchParams.get('returnDate')

//     const {cars, axios}= useAppContext();


//      const [input,setInput]=useState('')

//      const isSearchData = pickupLocation && pickupDate && returnDate
//      const [filteredcars, setFilteredCars]= useState([])

//      const applyFilter=async ()=>{
//       if(input === ''){
//         setFilteredCars(cars)
//         return null
//       }

//       const filtered =cars.slice().filter((car)=>{
//         return car.brand.toLowerCase().includes(input.toLowerCase()) ||  car.model.toLowerCase().includes(input.toLowerCase()) || car.category.toLowerCase().includes(input.toLowerCase()) || car.transmission.toLowerCase().includes(input.toLowerCase())
//       })
//       setFilteredCars(filtered)
//      }

//      const searchAvailability = async ()=>{
//       const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})

//       if(data.success)
//         {
//           setFilteredCars(data.availableCars)
//           if(data.availableCars.length === 0){
//             toast('No Cars Available')
//         }

//         return null
//       }
//      }

// useEffect(() => {
//   if (isSearchData) {
//     searchAvailability();
//   }
// }, [pickupLocation, pickupDate, returnDate]);



// useEffect(() => {
//   cars.length > 0 && !isSearchData && applyFilter();
// }, [input, cars]);

// // ⭐ NEW: Set default car list on page load
// useEffect(() => {
//   if (!isSearchData && cars.length > 0) {
//     setFilteredCars(cars);   // 👈 shows all cars by default
//   }
// }, [cars, isSearchData]);



//   return (
//     <div>
//          {/*----------------------- Title and Search Box -----------------------*/}
//        <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
//             <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

//             <div className='flex items-center bg-white px-4 mt-6 max-w-xl w-full h-12 rounded-full shadow'>

//               <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
//               {/* ---------------------Input Field--------------------- */}
//               <input onChange={(e)=>setInput(e.target.value)}
//                value={input} type="text"
//                placeholder='Search by make, model, or feature'
//               className='w-full h-full outline-none text-gray-500' />

//                <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
//             </div>
//        </div>

//          {/*----------------------- Car Section -----------------------*/}

//        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
//          <p className='text-gray-500 xl:px-20 max-w-7xl '>Showing {filteredcars.length} Cars</p>

//          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
//           {filteredcars.map((car,index)=>(
//             <div key={index}>
//                 <CarCard car={car}/>
//             </div>
//           ))}
//          </div>

//        </div>
      
//     </div>
//   )
// }

// export default Cars
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { CarCardSkeleton } from '../components/LoadingSkeleton'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const searchQuery = searchParams.get('search')

  const { cars, axios } = useAppContext()
  const [input, setInput] = useState(searchQuery || '')
  const [filteredCars, setFilteredCars] = useState([])
  const [loading, setLoading] = useState(false)
  const isSearchData = pickupLocation && pickupDate && returnDate

  // --------------------- Filter Function ---------------------
  const filterCars = (list) => {
    if (!input) return list
    return list.filter(
      (car) =>
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
    )
  }

  // --------------------- Fetch and Filter ---------------------
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      if (isSearchData) {
        console.log('🔍 Searching for cars:', { pickupLocation, pickupDate, returnDate })
        try {
          const { data } = await axios.post('/api/bookings/check-availability', {
            location: pickupLocation,
            pickupDate,
            returnDate
          })
          console.log('📦 API Response:', data)
          if (data.success) {
            const finalList = filterCars(data.availableCars)
            setFilteredCars(finalList)
            if (finalList.length === 0) {
              toast.error('No cars available for selected dates and location')
            } else {
              toast.success(`Found ${finalList.length} car(s)!`)
            }
          } else {
            toast.error(data.message || 'Search failed')
          }
        } catch (err) {
          console.error('❌ Search error:', err)
          toast.error('Error fetching cars. Check if server is running.')
        }
      } else {
        // No search params, show all cars filtered by input
        console.log('📋 Showing all cars, total:', cars.length)
        const finalList = filterCars(cars)
        setFilteredCars(finalList)
        
        // Show search result message if searching from navbar
        if (searchQuery && finalList.length > 0) {
          toast.success(`Found ${finalList.length} car(s) matching "${searchQuery}"`)
        }
      }
      setLoading(false)
    }
    fetchCars()
  }, [pickupLocation, pickupDate, returnDate, input, cars, axios, searchQuery])

  // --------------------- JSX ---------------------
  return (
    <div>
      {/* Title + Search Box */}
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title
            title='Available Cars'
            subTitle='Browse our selection of premium vehicles available for your next adventure'
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex items-center bg-white px-4 mt-6 max-w-xl w-full h-12 rounded-full shadow'
        >
          <img src={assets.search_icon} alt='' className='w-4.5 h-4.5 mr-2' />
          <input
            type='text'
            placeholder='Search by make, model, or feature'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='w-full h-full outline-none focus:outline-none text-gray-500'
            style={{ boxShadow: 'none' }}
            onFocus={(e) => e.target.style.outline = 'none'}
          />
          <img src={assets.filter_icon} alt='' className='w-4.5 h-4.5 ml-2' />
        </motion.div>
      </div>

      {/* Car Section */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-gray-500 xl:px-20 max-w-7xl'
        >
          Showing {filteredCars.length} Cars
        </motion.p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {loading ? (
            // Show skeleton loaders while loading
            Array(6).fill(0).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))
          ) : filteredCars.length > 0 ? (
            // Show car cards
            filteredCars.map((car, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))
          ) : (
            // Show empty state
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='col-span-full text-center py-20'
            >
              <p className='text-gray-500 text-lg'>No cars found matching your criteria</p>
              <p className='text-gray-400 text-sm mt-2'>Try adjusting your search filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cars
