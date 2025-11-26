import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const NavbarOwner = () => {
    const {user} = useAppContext()
  return (

    <div className='flex items-center justify-between px-6 md:px-10 py-4 text-gray-500 border-b border-borderColor relative transition-all'>

        <Link to='/'>
        <img src={assets.logo} alt="" className='h-7' />
        </Link>

        <div className='flex items-center gap-4'>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg truncate">Welcome, {user?.name || 'Owner'}</p>

          <Link to='/' className='px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg text-sm transition-all'>
            Go to Home
          </Link>
        </div>

    </div>
  )
}

export default NavbarOwner