"use client"

import { sidebarLinks } from '@/constants';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Bottombar = () => {
  const pathname=usePathname();
  const {userId}=useAuth();

  return (
    <div className=' bottombar w-full'>
      <div className=' flex flex-row items-center justify-between gap-3 xs:gap-5 w-full'>
      {sidebarLinks.map((link)=> {
          const isActice=link.route===pathname || (pathname.includes(link.route) && link.route.length>1)
          if(link.route==='/profile') link.route=`/profile/${userId}`

         return (
          <Link key={link.label} href={link.route} className={`relative flex flex-col items-center sm:p-2 max-sm:py-2 max-sm:px-4 rounded-lg ${isActice && ' bg-blue-500'}`}>
             <div className=' h-5 w-5'>
                <Image src={link.imagUrl} alt='image' height={20} width={20} className='object-contain' />
             </div>
                <span className=' text-light-1 max-sm:hidden text-sm' >{link.label.split(' ')[0]}</span>
          </Link>
         )
        })}
      </div>
    </div>
  )
}

export default Bottombar