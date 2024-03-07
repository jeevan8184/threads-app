"use client"
import { SignOutButton, SignedIn, currentUser, useAuth } from '@clerk/nextjs'
import { sidebarLinks } from '../../constants'
import Image from 'next/image'
import Link from 'next/link'
import { redirect, usePathname, useRouter } from 'next/navigation'


export default  function Leftsidebar() {
  const pathname=usePathname();
  const router=useRouter();
  const {userId}=useAuth();

  return (
      <div className=' leftsidebar flex justify-between relative'>
        <div className=' flex flex-col w-full'>
        {sidebarLinks.map((link)=> {
          const isActice=link.route===pathname || (pathname.includes(link.route) && link.route.length>1)

          if(link.route==='/profile') link.route=`/profile/${userId}`
          
         return (
          <Link key={link.label} href={link.route} className={`gap-2 relative flex p-6 py-3 rounded-lg ${isActice && ' bg-blue-500'}`}>
             <div className=' h-5 w-5'>
                <Image src={link.imagUrl} alt='image' height={20} width={20} className='object-contain' />
             </div>
                <span className=' text-light-1 max-lg:hidden'>{link.label}</span>
          </Link>
         )
        })}
        </div>
        <div className=' px-6 absolute bottom-6 flex gap-2'>
          <SignedIn>
             <SignOutButton signOutCallback={()=>router.push('/sign-in')}>
              <Image src='/assets/logout.svg' alt='logout' height={20} width={20} className=' object-contain cursor-pointer' />
             </SignOutButton>
          </SignedIn>
          <p className=' max-lg:hidden text-white'>logout</p>
        </div>
      </div>
  )
}

