
import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUser } from '@/lib/actions/User.action';
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';

async function Onboarding () {
  const user=await currentUser();
  if(!user) return null;

  const userInfo=await fetchUser(user.id);
  

  if(userInfo?.onboarded) redirect('/');

  const userData={
    id:user?.id,
    username:userInfo?.username || user?.lastName,
    name:userInfo?.name || user?.firstName,
    bio:userInfo?.bio || "",
    image:userInfo?.image || user?.imageUrl
    
  }

  return (
    <div className=' flex-center w-full px-10 py-20 bg-black flex-col'>
      <h1 className=' text-light-1 font-extrabold flex-start text-4xl'>Onboarding</h1>
      <p className=' text-light-1 m-2'>Complete Your profile to use threads</p>
        <div className=' bg-dark-2 max-w-[400px] p-10 rounded-md'>
          <AccountProfile user={userData} btnTitle="continue" />
        </div>
    </div>
  )
}

export default Onboarding