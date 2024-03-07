
import { fetchUserPosts } from "@/lib/actions/User.action"
import ThreadCard from "../cards/ThreadCard"

interface Props {
  userId:string,
  accountId:string,
  accountType:string
}

const ThreadsTab =async ({ userId, accountId, accountType }:Props) => {

  const result=await fetchUserPosts(accountId);

  return (
   <section className="">
      {result?.threads.map((thread:any)=> (
        <ThreadCard 
          key={thread._id}
          id={thread._id}
          currentUserId={userId}
          text={thread.text}
          parentId={thread.parentId}
          author={accountType==='User' ? {id:result.id, name:result.name,image:result.image} :
                {id:thread.author.id, name:thread.author.name,image:thread.author.image}}//to do
          community={thread.community} //to do
          createdAt={thread.createdAt}
          children={thread.children}
        />
      ))}
   </section>
  )
}

export default ThreadsTab
