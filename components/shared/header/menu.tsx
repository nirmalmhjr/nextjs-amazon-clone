import {ShoppingCartIcon, UserIcon} from 'lucide-react'
import Link from 'next/link'
import CartButton from './cart-button'
import UserButton from './user-button'
import { EllipsisVertical } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import ThemeSwitcher from './theme-switcher'

export default function Menu(){
// export default function Menu({forAdmin = false}:{forAdmin?:boolean}){
 return(
         <div className='flex justify-end'>
            <nav className='hidden md:flex gap-3 w-full'>
                {/* <Link href={"/signin"} className='header-button flex items-center'>
                    <UserIcon className='size-8'/>
                    <span className='font-bold'>Hello, Sign In</span>
                </Link> */}
                <ThemeSwitcher /> 
               <UserButton />
               <CartButton />
                {/* {forAdmin ? null : <CartButton />} */}
            </nav>
            <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger className='align-middle header-button'>
            <EllipsisVertical className='h-6 w-6' />
          </SheetTrigger>
          <SheetContent className='bg-black text-white  flex flex-col items-start  '>
            <SheetHeader className='w-full'>
              <div className='flex items-center justify-between '>
                <SheetTitle>Site Menu</SheetTitle>
                <SheetDescription></SheetDescription>
              </div>
            </SheetHeader>
            <ThemeSwitcher />
            <UserButton />
            <CartButton />
          </SheetContent>
        </Sheet>
        </nav>
        </div>
 )

}

// export default function Menu(){

//     return(
//         <div className='flex justify-end'>
//             <nav className='flex gap-3 w-full'>
//                 {/* <Link href={"/signin"} className='header-button flex items-center'>
//                     <UserIcon className='size-8'/>
//                     <span className='font-bold'>Hello, Sign In</span>
//                 </Link> */}

//                <UserButton />
//                 <CartButton />
//             </nav>
//         </div>
//     )
// }