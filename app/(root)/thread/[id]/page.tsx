import ThreadCard from "@/components/cards/ThreadCard";
import CommentsThread from "@/components/forms/CommentThreads";
import { fetchThreadById } from "@/lib/actions/Thread.action"
import { fetchUser } from "@/lib/actions/User.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page=async({params}:{params:{id:string}})=> {

    const user=await currentUser();
    if(!user) return null;

    const userInfo=await fetchUser(user.id);
    if(!userInfo.onboarded) redirect('/onboarding');
    const thread=await fetchThreadById(params.id);

    return (
        <div className=" flex flex-col w-full my-2 pr-3 pb-14">

            <ThreadCard 
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                text={thread.text}
                community={thread.community}
                author={thread.author}
                children={thread.children}
                createdAt={thread.createdAt}
                parentId={thread.parentId}
            />

            <div className=" mt-4">
                <CommentsThread userId={JSON.stringify(userInfo._id)} threadId={params.id} image={userInfo.image} />
            </div>

            <div className=" flex-start flex-col">
                {thread.children.map((thread:any)=> (
                    <ThreadCard 
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    text={thread.text}
                    community={thread.community}
                    author={thread.author}
                    children={thread.children}
                    createdAt={thread.createdAt}
                    parentId={thread.parentId}
                />
                ))}
            </div>

        </div>
    )
}

export default Page;