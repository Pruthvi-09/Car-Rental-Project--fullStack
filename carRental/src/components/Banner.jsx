import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Banner = () => {
  const {user, navigate, isOwner, setIsOwner, axios} = useAppContext()

  const handleListCar = async () => {
    if(!user){
      toast.error('Please login first')
      return
    }

    if(!isOwner){
      // Change role to owner first
      try {
        const { data } = await axios.post('/api/owner/change-role')
        if (data.success) {
          setIsOwner(true)
          toast.success(data.message)
          navigate('/owner/add-car')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error('Failed to change role')
      }
    } else {
      // Already an owner, go directly to add car
      navigate('/owner/add-car')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3  md:m-auto rounded-2xl overflow-hidden'
    >
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='text-white '
            >
                <h2 className='text-3xl font-medium'> Do You Own a Luxury Car?</h2>
                <p className='mt-2'>Monetize your vehicle effortlessly by listing it on CarRental</p>
                <p className='max-w-130'>We take care of insurance , driver verification and secure payments- so you can earn passive income, stress-free.</p>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleListCar} 
                  className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer'
                >
                  List your Car
                </motion.button>
            </motion.div>
            {/* -----------------Banner Image -----------------*/}
            <motion.img 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              src={assets.banner_car_image} 
              alt="car" 
              className='max-h-40 mt-5' 
            />

    </motion.div>
  )
}

export default Banner