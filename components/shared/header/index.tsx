import Search from "./search"

import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import data from "@/lib/data"
import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import Sidebar from "./sidebar"
import { getAllCategories } from "@/lib/actions/product.actions"
import Menu from "./menu"


export default async function Header() {
    const categories = await getAllCategories()

  return (
    <header className="bg-black text-white">
        <div className="px-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/"
                        className="flex items-center header-button font-extrabold text-2xl m-1"
                    >
                        <Image 
                            src={'/icons/logo.svg'}
                            width={40}
                            height={40}
                            alt={`${APP_NAME} logo`}
                        />
                        {APP_NAME}
                    </Link>
                </div>
                <div className="hidden md:block flex-1 max-w-xl">
                    <Search />
                </div>
                <Menu />
            </div>
                <div className="md:hidden block py-2">
                    <Search/>
                </div>
            <div className="flex items-center px-3 mb-[1px] bg-gray-800 -mx-2">
                <Sidebar categories={categories}/>
                <div className="flex items-center flex-wrap gap-3 overflow-hidden max-h-[42px]">
                    {data.headerMenus.map((menu)=>(
                        <Link href={menu.href}
                            key={menu.href}
                            className="header-button !p-2"
                        >{menu.name}</Link>
                    ))}
                </div>
            </div>
        </div>
    </header>
  )
}

