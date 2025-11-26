import React, { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import { LoadingSpinner } from '../components/LoadingSkeleton'

// Lazy load components that are below the fold
const FeaturedSection = lazy(() => import('../components/FeaturedSection'))
const Banner = lazy(() => import('../components/Banner'))
const Testimonials = lazy(() => import('../components/Testimonials'))
const Newsletter = lazy(() => import('../components/Newsletter'))

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero/>
      
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedSection/>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Banner/>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials/>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Newsletter/>
      </Suspense>
    </motion.div>
  )
}

export default Home