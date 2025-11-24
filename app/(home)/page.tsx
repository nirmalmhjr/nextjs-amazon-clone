import { HomeCarousel } from '@/components/shared/home/home-carousel'
import React from 'react'
import data from '@/lib/data'

export default async function Page() {
  return (
    <div>
      {/* <h1 className='h1-bold text-center p-10'>Home Page Content</h1> */}
      <HomeCarousel items={data.carousels}/>
    </div>
  )
}

