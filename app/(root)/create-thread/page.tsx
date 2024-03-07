import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/User.action";
import { currentUser } from "@clerk/nextjs";


export default async function Page() {
    const user=await currentUser();
    if(!user) return null;

    const userInfo=await fetchUser(user.id);
    
    console.log('create thread page')
    return (
        <div className=" w-full">
            <h1 className=" font-extrabold sm:text-5xl text-3xl text-light-1">Create Thread...</h1>
            <PostThread userId={userInfo?._id} />
        </div>
    )
}

