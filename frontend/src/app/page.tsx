import React from 'react'
import { HeroSection } from '@/components/home/hero-section';

const page = () => {
  return (
     <div className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 overflow-hidden">
      <HeroSection />
    </div>
  )
}

export default page
