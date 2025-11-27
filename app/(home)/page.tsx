import { HomeCarousel } from '@/components/shared/home/home-carousel'
import React from 'react'
import data from '@/lib/data'
import { HomeCard } from '@/components/shared/home/home-card'
import {Card,CardContent} from '@/components/ui/card'
import { getAllCategories, getProductByTag, getProductForCard } from '@/lib/actions/product.actions'
import { toSlug } from '@/lib/utils'
import ProductSlider from '@/components/shared/product/product-slider'

export default async function Page() {
  const categories = (await getAllCategories()).slice(0 , 4)
  const newArrivals = await getProductForCard({tag: 'new-arrival', limit:4})

  const featureds = await getProductForCard({tag: 'featured', limit: 4})
  const bestSellers = await getProductForCard({ tag: 'best-seller', limit: 4})

  const todaysDeals = await getProductByTag({tag:'todays-deal'})

  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/search'
      },
      items: categories.map((category)=>({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`
      }))
    },
       {
      title: 'Explore New Arrivals',
      items: newArrivals,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Discover Best Sellers',
      items: bestSellers,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Featured Products',
      items: featureds,
      link: {
        text: 'Shop Now',
        href: '/search?tag=new-arrival',
      },
    },
  ]
  // console.log(cards)

  return (
    <>
      {/* <h1 className='h1-bold text-center p-10'>Home Page Content</h1> */}
      <HomeCarousel items={data.carousels}/>
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider title={"Today's Deal"} products={todaysDeals}/>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

