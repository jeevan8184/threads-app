"use client"

import { OrganizationSwitcher, SignOutButton, SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { dark } from '@clerk/themes'

const Topbar = () => {
  const router=useRouter();
  return (
    <div className='topbar'>
      <div className=' flex gap-3'>
        <Link href='/'>
          <Image 
            src='/assets/logo.svg'
            alt='logo'
            height={30}
            width={30}
            className=' object-contain'
          />
        </Link>
        <h1 className=' text-white font-extrabold text-3xl'>Threads</h1>
      </div>
      <div className=' flex'>
        <div className=' block md:hidden'>
           <SignedIn>
             <SignOutButton signOutCallback={()=> router.push('/sign-in')}>
               <div className=' flex cursor-pointer'>
                 <Image  src='/assets/logout.svg' alt='logout' height={24} width={24} className=' object-contain'/>
               </div>
             </SignOutButton>
           </SignedIn>
        </div>
        <OrganizationSwitcher 
          appearance={{
            baseTheme:dark,
            elements:{
              organizationSwitcherTrigger:' py-2 px-4'
            }
          }}
        />
      </div>
    </div>
  )
}

export default Topbar