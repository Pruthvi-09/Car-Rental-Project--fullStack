import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL= import.meta.env.VITE_BASE_URL



export const AppContext= createContext();

export const AppProvider = ({children})=>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY;

    const [token,setToken]=useState(null)
    const [user,setUser]=useState(null)
    const [isOwner, setIsOwner]=useState(null)
    const [showLogin, setShowLogin]= useState(null)
    const [pickupDate, setPickupDate]= useState('')
    const [returnDate, setReturnDate]= useState('')
    const [loading, setLoading] = useState(true)

    const [cars, setCars]= useState([])

    // Function to check if user is logged in

    // const fetchUser = async ()=>{
    //     try {

    //      const{ data } =  await axios.get('/api/user/data')
    //      if(data.sucees){
    //         setUser(data.user)
    //         setIsOwner(data.user.role === 'owner')
    //      }else{
    //         navigate('/')
    //      }
            
    //     } catch (error) {
    //         toast.error(error.message)
            
    //     }
    // }
const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user/data");

    if (data.success) {
      setUser(data.user);
      setIsOwner(data.user.role === "owner");
    }
  } catch (error) {
    console.log("Fetch user error:", error.message);
  }
};

    // Function to fetch all cars from the server

    const fetchCars= async ()=>{
        try {
            
            const {data}= await axios.get('/api/user/cars')
            if(data.success){
                setCars(data.cars)
            }

        } catch (error) {
            console.log("Fetch cars error:", error.message)
        }
    }

    // Function to logout the user
     const logout = async ()=>{

        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
         axios.defaults.headers.common['Authorization']=''
         toast.success('You have been logged out')


     }



    // useEffect to retrive the token from localStorage

    useEffect(()=>{
        const storedToken =localStorage.getItem('token')
        if(storedToken){
            setToken(storedToken)
        }
        // Set loading to false after checking token
        setTimeout(() => setLoading(false), 1000)
    },[])

     // useEffect to fetch user data when token is available
      useEffect(()=>{

        if(token){
            axios.defaults.headers.common['Authorization']=`Bearer ${token}`
            fetchUser();
            fetchCars();
        }
      
    },[token])



    // const value={
    //                 navigate,currency,axios,user,setUser,token, setToken, isOwner,fetchUser,showLogin,
    //                 setShowLogin, logout, fetchCars, cars, setCars,
    //                 pickUpDate, setPickUpDate,returnDate,setReturnDate


    // }
    // Function to refresh all data
    const refreshData = async () => {
      if(token){
        await Promise.all([fetchUser(), fetchCars()])
      }
    }

    const value = {
  navigate,
  currency,
  axios,
  user,
  setUser,
  token,
  setToken,
  isOwner,
  setIsOwner,
  fetchUser,
  showLogin,
  setShowLogin,
  logout,
  fetchCars,
  cars,
  setCars,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  loading,
  setLoading,
  refreshData
};


    return(
        <AppContext.Provider value={value}>
            {
                children
            }

            </AppContext.Provider>
    )

}

export const useAppContext =()=>{
    return useContext(AppContext)
}