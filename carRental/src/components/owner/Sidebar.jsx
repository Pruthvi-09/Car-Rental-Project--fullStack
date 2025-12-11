import React, { useState } from 'react'
import {dummyUserData,  assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const {user, axios, fetchUser}= useAppContext()
  const location = useLocation();
  const [image, setImage]=useState('')

  const updateImage = async ()=>{
    //  user.image=URL.createObjectURL(image)  // returns temeprry url (file object ko browser directly display nahi kar sakta.)
    // setImage('')  // to hide save button
   try {

    const formData= new FormData()
    formData.append('image', image)

    const {data} = await axios.post('/api/owner/update-image', formData)

    if (data.success){
      fetchUser()
      toast.success(data.message)
      setImage('')
    }else{
      toast.error(data.message)
    }
    
   } catch (error) {
    toast.error(error.message)
   }
  }
  return (
    //  <div className='relative min-h-screen flex-none w-52 md:w-60 flex flex-col pt-8 border-r border-borderColor text-sm'>
    <div className="relative min-h-screen w-40 sm:w-48 md:w-60 flex flex-col pt-8 border-r border-borderColor text-sm">


       <div className='group relative'>
          <label htmlFor="image">
              <img 
                src={image ? URL.createObjectURL(image) : user?.image ? `${user.image}?t=${Date.now()}` : 'https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                alt=""  
                className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover'
                key={user?.image}
              />
                {/* -------------------------Image accpets here from user -------------------------*/}
              <input type="file"  id="image" accept='image/*' hidden onChange={e=>setImage(e.target.files[0])}  className=''/>

              <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10  group-hover:flex items-center justify-center cursor-pointer h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto'>
                        <img src={assets.edit_icon} alt="" />
              </div>
          </label>
       </div>

       {/* when setImage gets value then save button will be appear */}
                
       {
        image && (
               <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer' onClick={updateImage} >
                Save <img src={assets.check_icon} width={13} alt="" />
               </button>
        )}

        <p className='w-full text-center'>{user?.name}</p>
        {/* -----------------------------------------------------(  Sidebar  )---------------------------------------------------------------------- */}

        <div className='w-full'>
                 {
                  ownerMenuLinks.map((link,index)=>(
                    <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary': 'text-gray'} `}>

                      {/*----------------- image|| car-icon ----------------*/}
                      <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />

                      <span className='max-sm:hidden'>{link.name}</span>

                       <div className={`${link.path === location.pathname ? 'bg-primary' : ''} w-1.5 h-8 rounded-l right-0 absolute`}>


                      </div>


                    </NavLink>
                  ))
                 }
        </div>
        
    </div>
  )
}

export default Sidebar

// import React, { useState } from 'react'
// import {dummyUserData,  assets, ownerMenuLinks } from '../../assets/assets'
// import { NavLink, useLocation } from 'react-router-dom'

// const Sidebar = () => {

//   const user = dummyUserData;
//   const location = useLocation();
//   const [image, setImage] = useState('');

//   const updateImage = () => {
//     user.image = URL.createObjectURL(image);
//     setImage('');
//   };

//   return (
// <div className="relative min-h-screen md:flex flex-col items-center pt-8 w-52 md:w-60 border-r border-borderColor text-sm">

//       {/* Profile Image */}
//       <div className="group relative">
//         <label htmlFor="image">
//           <img
//             src={
//               image
//                 ? URL.createObjectURL(image)
//                 : user?.image ||
//                   'https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop'
//             }
//             alt=""
//           />

//           <input
//             type="file"
//             id="image"
//             accept="image/*"
//             hidden
//             onChange={(e) => setImage(e.target.files[0])}
//           />

//           <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
//             <img src={assets.edit_icon} alt="" />
//           </div>
//         </label>
//       </div>

//       {/* Save button when image uploaded */}
//       {image && (
//         <button className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer">
//           Save
//           <img
//             src={assets.check_icon}
//             width={13}
//             onClick={updateImage}
//             alt=""
//           />
//         </button>
//       )}

//       <p className="w-full">{user?.name}</p>

//       {/* Sidebar Menu */}
//       <div className="w-full">
//         {ownerMenuLinks.map((link, index) => {
//           const isActive = link.path === location.pathname;

//           return (
//             <NavLink
//               key={index}
//               to={link.path}
//               className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
//                 isActive ? 'bg-primary/10 text-primary' : 'text-gray'
//               }`}
//             >
//               {/* Icon */}
//               <img
//                 src={isActive ? link.coloredIcon : link.icon}
//                 alt="icon"
//               />

//               <span className="max-md:hidden">{link.name}</span>

//               {/* Right highlight bar */}
//               <div
//                 className={[
//                   isActive && 'bg-primary',
//                   'w-1.5 h-8 rounded-l right-0 absolute'
//                 ]
//                   .filter(Boolean)
//                   .join(' ')}
//               ></div>
//             </NavLink>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
