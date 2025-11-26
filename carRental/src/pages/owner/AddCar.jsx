import { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency, navigate, fetchCars}=useAppContext()
  const [image ,setImage]=useState(null)
  const [additionalImages, setAdditionalImages] = useState([])
  const [car, setCar]=useState({
      brand:'', 
      model:'',
      year:'',
      pricePerDay:'',
      category:'',
      transmission:'',
      fuel_type:'',
      seating_capacity:'',
      location:'',
      description:'',
      mileage:''
  })

  const [isLoading, setIsLoading]= useState(false)

  const onSubmitHandler= async (e)=> {
    e.preventDefault()
    if(isLoading) return null

    // Validate image is selected
    if(!image){
      toast.error('Please upload a car image')
      return
    }

    setIsLoading(true)
    try {

      const formData = new FormData()
      formData.append('image', image)
      
      // Append additional images
      additionalImages.forEach((img) => {
        formData.append('additionalImages', img)
      })
      
      formData.append('carData',JSON.stringify(car))

      const {data}= await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        // Refresh cars list
        await fetchCars()
        // Navigate to dashboard to see updated car count
        navigate('/owner')
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }finally{
      setIsLoading(false)
    }

  }


  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      {/* Title */}
      <Title title='Add New Car' subTitle='Fill the details to list a new car for booking , including pricing , availability, and car specifications.'/>

      {/* Submit Form */}

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* --------------------------Car Main image-------------------------- */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
                <img src={image ? URL.createObjectURL(image): assets.upload_icon} alt=""  className='h-14 rounded cursor-pointer' />
                <input type="file"  id="car-image" accept='image/*' hidden onChange={e=>setImage(e.target.files[0])}/>
          </label>

          <p className='text-sm text-gray-500'>Upload main picture of your car *</p>
        </div>

        {/* --------------------------Additional Car images-------------------------- */}
        <div className='flex flex-col gap-2 w-full'>
          <label htmlFor="additional-images" className='flex items-center gap-2 cursor-pointer'>
            <div className='px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-primary transition-colors'>
              <span className='text-sm text-gray-600'>+ Add More Images (Optional)</span>
            </div>
            <input 
              type="file" 
              id="additional-images" 
              accept='image/*' 
              multiple 
              hidden 
              onChange={e => setAdditionalImages([...additionalImages, ...Array.from(e.target.files)])}
            />
          </label>
          
          {/* Preview additional images */}
          {additionalImages.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {additionalImages.map((img, index) => (
                <div key={index} className='relative'>
                  <img 
                    src={URL.createObjectURL(img)} 
                    alt={`Additional ${index + 1}`} 
                    className='h-16 w-16 object-cover rounded border'
                  />
                  <button
                    type='button'
                    onClick={() => setAdditionalImages(additionalImages.filter((_, i) => i !== index))}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className='text-xs text-gray-400'>Upload up to 5 additional images to showcase your car</p>
        </div>

        {/*----------------------- Car Brand and Model----------------------- */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
               {/* brand */}
              <div className='flex flex-col w-full'>
                <label >Brand</label>
                <input type="text" 
                        placeholder='eg.BMW, Tata, Toyota' 
                        required 
                        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                        value={car.brand}
                        onChange={e=> setCar({...car, brand: e.target.value})}
                         />
              </div>



               {/* Model */}
              <div className='flex flex-col w-full'>
                <label >Model</label>
                <input type="text" 
                        placeholder='eg.X5, E-Class, M4' 
                        required 
                        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                        value={car.model}
                        onChange={e=> setCar({...car, model: e.target.value})}
                         />
              </div>
        </div>

        {/*----------------------- Car Year , Price and Category----------------------- */}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

          
               {/* Year */}
              <div className='flex flex-col w-full'>
                <label >Year</label>
                <input type="number" 
                        placeholder='eg.2025' 
                        required 
                        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                        value={car.year}
                        onChange={e=> setCar({...car, year: Number(e.target.value)})}
                         />
              </div>

                {/* Price */}
              <div className='flex flex-col w-full'>
                <label > Daily Price ({currency})</label>
                <input type="number" 
                        placeholder='100' 
                        required 
                        min="1"
                        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                        value={car.pricePerDay || ''}
                        onChange={e=> setCar({...car, pricePerDay: e.target.value ? Number(e.target.value) : ''})}
                         />
              </div>

               {/* Category */}
              <div className='flex flex-col w-full'>
                <label > Category</label>
               <select onChange={e=>setCar({...car,category: e.target.value})} value={car.category} required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white cursor-pointer'>
                       <option value="">Select a category</option>
                       <option value="Sedan">Sedan</option>
                       <option value="SUV">SUV</option>
                       <option value="Van">Van</option>

               </select>
              </div>
        </div>

                {/*----------------------- Car Transmission , Fuel Type and Seating Capacity----------------------- */}

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>

                  
               {/* Transmission */}
              <div className='flex flex-col w-full'>
                <label >Transmission</label>
                 <select onChange={e=>setCar({...car,transmission: e.target.value})} value={car.transmission} required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white cursor-pointer'>
                       <option value="">Select a transmission</option>
                       <option value="Automatic">Automatic</option>
                       <option value="Manual">Manual</option>
                       <option value="Semi-Automatic">Semi-Automatic</option>

               </select>
              </div>

               {/* Fuel Type */}
              <div className='flex flex-col w-full'>
                <label >Fuel Type</label>
                 <select onChange={e=>setCar({...car,fuel_type: e.target.value})} value={car.fuel_type} required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white cursor-pointer'>
                       <option value="">Select a Fuel Type</option>
                       <option value="Gas">Gas</option>
                       <option value="Diesel">Diesel</option>
                       <option value="Petrol">Petrol</option>
                       <option value="Electric">Electric</option>
                       <option value="Hybrid">Hybrid</option>
               </select>
              </div>

               {/* Seating Capacity */}
              <div className='flex flex-col w-full'>
                <label >Seating Capacity</label>
                <input type="number" 
                        placeholder='ex, 2' 
                        required 
                        className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                        value={car.seating_capacity}
                        onChange={e=> setCar({...car, seating_capacity: Number(e.target.value)})}
                         />
              </div>
         </div>

                {/*----------------------- Car Location and Mileage----------------------- */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='flex flex-col w-full'>
                         <label >Location</label>
                          <select onChange={e=>setCar({...car,location: e.target.value})} value={car.location} required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none bg-white cursor-pointer'>
                                  <option value=""> Select location </option>
                                  <option value="Mumbai">Mumbai</option>
                                  <option value="Delhi">Delhi</option>
                                  <option value="Bangalore">Bangalore</option>
                                  <option value="Hyderabad">Hyderabad</option>
                                  <option value="Ahmedabad">Ahmedabad</option>
                                  <option value="Chennai">Chennai</option>
                                  <option value="Kolkata">Kolkata</option>
                                  <option value="Pune">Pune</option>
                                  <option value="Jaipur">Jaipur</option>
                                  <option value="Surat">Surat</option>
                           </select>
                  </div>

                  {/* Mileage */}
                  <div className='flex flex-col w-full'>
                    <label >Mileage (km/l)</label>
                    <input type="number" 
                            placeholder='e.g., 15' 
                            min="1"
                            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                            value={car.mileage || ''}
                            onChange={e=> setCar({...car, mileage: e.target.value ? Number(e.target.value) : ''})}
                             />
                  </div>
                </div>


                {/*----------------------- Description ----------------------- */}

                <div className='flex flex-col w-full'>
                  <label >Description</label>
                  <textarea  rows={5}
                            placeholder='eg. A luxury SUV with a specious interior' 
                            required 
                            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                            value={car.description}
                            onChange={e=> setCar({...car, description: e.target.value})}
                   ></textarea>
                </div>


                <button  className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
                  <img src={assets.tick_icon} alt="" /> {isLoading ?'Listing......':'List Your Car'}
                </button>






      </form>



    </div>
  )
}

export default AddCar