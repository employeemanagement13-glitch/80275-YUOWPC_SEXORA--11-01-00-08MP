"use client"
import React from 'react'
import TrustedClients from '../Home/TrustedClients'
import { globalPartnersData } from '@/lib/data'

const GlobalPartners = () => {
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 text-[#454648] bg-white'>
    <TrustedClients group={globalPartnersData} />
    </div>
  )
}

export default GlobalPartners