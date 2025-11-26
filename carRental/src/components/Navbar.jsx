import { useState } from "react";
import { motion } from "framer-motion";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../index.css";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {

  const {setShowLogin,user,logout, isOwner,axios, setIsOwner}= useAppContext()

    const location =useLocation() // for location

    const [open,setOpen]=useState(false) // by default menu bar is closed for mobile size
    const [searchQuery, setSearchQuery] = useState('')
    const navigate=useNavigate()  // for change the paths

    const handleListCars = () => {
      setOpen(false) // Close mobile menu
      
      // Check if user is logged in
      if(!user){
        toast.error('Please login to list your car')
        setShowLogin(true)
        return
      }

      // If logged in, proceed with role change or navigation
      if(isOwner){
        navigate('/owner')
      } else {
        changeRole()
      }
    }

    const changeRole = async () => {
      try {
        const { data } = await axios.post('/api/owner/change-role');

        if (data.success) {
          setIsOwner(true);
          toast.success(data.message);
          navigate('/owner/add-car')
        } else {
          toast.error(data.message);
        }

      } catch (error) {
        toast.error(error.message);
      }
    };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 
        xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all 
        ${location.pathname === '/' && "bg-light"}
        `}
     >
      <Link to="/">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          src={assets.logo} 
          alt="logo" 
          className="h-8" 
        />
      </Link>

      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16
       max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-none 
        duration-75 z-50 ${location.pathname === '/'? "bg-light":"bg-white"}
        ${open?"max-sm:translate-x-0":"max-sm:translate-x-full"}
        `}>

         {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setOpen(false)}>
            <motion.span
              whileHover={{ scale: 1.05, color: "#2563EB" }}
              transition={{ duration: 0.2 }}
              className={`${location.pathname === link.path ? 'text-primary font-semibold' : ''}`}
            >
              {link.name}
            </motion.span>
          </Link>
        ))}

        
            {/*input field */}
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            if(searchQuery.trim()) {
              navigate(`/cars?search=${searchQuery}`)
              setSearchQuery('')
            }
          }}
          className="hidden lg:flex items-center text-sm gap-2 border border-borderColor dark:border-gray-700 px-3 rounded-full max-w-56"
        >
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-1.5 w-full bg-transparent outline-none focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 font-medium"
          style={{color: '#1F2937', boxShadow: 'none'}}
          placeholder="Search cars..."
          onFocus={(e) => e.target.style.outline = 'none'}
        />
        <button type="submit">
          <img src={assets.search_icon} alt="search" className="cursor-pointer" />
        </button>
        </form>


      
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
             {/* Dashboard Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer" 
              onClick={handleListCars}
            >
              {isOwner?"Dashboard":"List cars"}
            </motion.button>
               {/* Login Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer px-8 py-2 bg-primary
              hover:bg-primary-dull transition-all text-white rounded-lg
              " 
              onClick={()=>{
                setOpen(false) // Close mobile menu
                user ? logout() : setShowLogin(true)
              }}
            > 
              {user ? 'Logout':'Login'}
            </motion.button>

             {/* User Profile Image - Always visible */}
             <div className="flex items-center gap-2">
               <img 
                 src={user?.image || assets.user_profile} 
                 alt={user?.name || 'User'} 
                 className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
               />
               {user && <span className="text-base font-bold" style={{color: '#9CA3AF'}}>{user.name}</span>}
             </div>
        </div>

      </div>

    {/* open and close button */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="sm:hidden cursor-pointer" 
        aria-label="menu" 
        onClick={()=>setOpen(!open)}
      >
         <img src={open? assets.close_icon : assets.menu_icon} alt="menu" />
      </motion.button>
    </motion.div>
  );
};

export default Navbar