import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import AppLoader from './components/AppLoader'
import { useLocation, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import DashBoard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'




function App() {
 
const {showLogin, loading}=useAppContext()
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner') // when the path startswith "/owner" then this is owner's page

  // Show loader on initial app load
  if (loading) {
    return <AppLoader />
  }

  return (
   <div className="min-h-screen bg-white transition-colors overflow-x-hidden">
      {/* Toaster with highest z-index */}
   <Toaster 
     position="top-center"
     containerStyle={{
       zIndex: 99999,
     }}
     toastOptions={{
       className: '',
       style: {
         zIndex: 99999,
       },
       success: {
         duration: 3000,
         style: {
           zIndex: 99999,
         },
       },
       error: {
         duration: 4000,
         style: {
           zIndex: 99999,
         },
       },
     }}
   />
   

   {showLogin &&    <Login/>}

   {!isOwnerPath && < Navbar />} {/*it means whenever owner path opens navbar hides  if there has no ownerpath them show navbar  */}

    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={
          <PageTransition>
            <Home/>
          </PageTransition>
        }/>
        <Route path='/car-details/:id' element={
          <PageTransition>
            <CarDetails/>
          </PageTransition>
        }/>
        <Route path='/cars' element={
          <PageTransition>
            <Cars/>
          </PageTransition>
        }/>
        <Route path='/my-bookings' element={
          <PageTransition>
            <MyBookings/>
          </PageTransition>
        }/>

        <Route path='/owner' element={<Layout/>}>
               <Route index element={<DashBoard/>}/>
               <Route path='add-car' element={<AddCar/>}/>
               <Route path='manage-cars' element={<ManageCars/>}/>
               <Route path='manage-bookings' element={<ManageBookings/>}/>     
        </Route>

      </Routes>
    </AnimatePresence>

    {!isOwnerPath && <Footer/>} {/* Here because it shows in every page */}
    
    {/* Scroll to top button */}
    <ScrollToTop />

   </div>
  )
}

// Page transition wrapper component
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

export default App
