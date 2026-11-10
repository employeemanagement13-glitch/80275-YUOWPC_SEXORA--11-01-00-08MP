"use client"
import TrustedClients from '../Home/TrustedClients'
import { folllowpathway } from '@/lib/data'

const PathwaySection = () => {
  return (
    <div className='bg-white w-full py-20'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <TrustedClients group={folllowpathway} />
    </div>
    </div>
  )
}

export default PathwaySection