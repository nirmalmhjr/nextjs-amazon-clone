import { auth } from "@/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignOut } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default async function  UserButton(){
    const session = await auth()
    console.log('234224234324',session)

    return(
        <div className='flex gap-2 items-center z-10'>
      <DropdownMenu>
        <DropdownMenuTrigger className='header-button' asChild>
          <div className='flex items-center'>
            <div className='flex flex-col text-xs text-left'>
              <span>Hello, {session ? session.user.name : 'sign in'}</span>
              <span className='font-bold'>Account & Orders</span>
            </div>
            <ChevronDown />
          </div>
        </DropdownMenuTrigger>
        {session ? (
          <DropdownMenuContent className='w-56 py-4 px-2 rounded space-y-2 bg-white shadow-xl text-black text-sm'  align='end' >
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {session.user.name}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup className="space-y-2 flex flex-col  ">
              <Link className='w-full focus:outline-none focus:ring-0 hover:bg-accent' href='/account' >
                <DropdownMenuItem>Your account</DropdownMenuItem>
              </Link>
              <Link className='w-full' href='/account/orders'>
                <DropdownMenuItem>Your orders</DropdownMenuItem>
              </Link>

              {session.user.role === 'Admin' && (
                <Link className='w-full' href='/admin/overview'>
                  <DropdownMenuItem>Admin</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem className='p-0 mb-1'>
              <form action={SignOut} className='w-full'>
                <Button
                  className='w-full py-4 px-2 h-4 justify-start'
                  variant='ghost'
                >
                  Sign out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent className='w-56  py-4 px-2 rounded space-y-2 bg-white shadow-xl' align='end' >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link
                  className={cn(buttonVariants(), 'w-full')}
                  href='/sign-in'
                >
                  Sign in
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className='font-normal text-black '>
                New Customer? <Link href='/sign-up'>Sign up</Link>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
    )

}