import { fetchUser, getActivity } from "@/lib/actions/User.action";
import { currentUser } from "@clerk/nextjs"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Page () {

    const user=await currentUser();
    if(!user) return null;
    const userInfo=await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');

    const replies=await getActivity(userInfo._id);

    return (
        <div className=" pr-3 w-full py-5 mb-36">
            <div className=" text-light-1">
                <h1 className=" text-light-1 font-extrabold text-3xl mb-6">Replies to Your Post...</h1>
                {replies.length> 0 ? (
                    <>
                      {replies.map((reply)=> (
                        <div key={reply._id} className="bg-dark-2 rounded-2xl px-6 py-2 items-center">
                            <Link href={`/thread/${reply.parentId}`} className=" flex items-center">
                               <div className=" h-12 w-12 relative">
                                    <Image src={reply.author.image} fill alt="image" className=" object-contain rounded-full" />
                               </div>
                                 <p className=" text-light-1 ">
                                    <span className=" text-blue-500 font-semibold ">{reply.author.name}</span>
                                    {"   "}
                                    replied to Your Post
                                 </p>
                            </Link>
                        </div>
                      ))}
                    </>
                ):(
                    <p className=" flex-center text-light-3 ">No replies to your posts</p>
                )}
            </div>
        </div>
    )
}