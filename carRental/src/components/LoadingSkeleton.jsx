import React from 'react'
import { motion } from 'framer-motion'

// Skeleton for car cards
export const CarCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Skeleton for car details page
export const CarDetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      </div>
    </div>
  )
}

// Skeleton for booking cards
export const BookingCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex gap-4">
        <div className="w-32 h-24 bg-gray-200 rounded animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </div>
    </div>
  )
}

// Generic loading spinner
export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

// Page loading overlay
export const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    </motion.div>
  )
}
