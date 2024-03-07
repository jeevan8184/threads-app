import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/Thread.action";
import { currentUser } from "@clerk/nextjs";



export default async function Home() {
  const user=await currentUser();

  const result=await fetchPosts(1,10);

  console.log('result',result.posts);

  return (
    <div className=" px-4 text-light-1 w-full py-6 mb-36">
      <h1 className=" sm:text-2xl text-xl font-extrabold my-4">Home</h1>
      <section className=" flex flex-col w-full">
         {result.posts.length===0 ? (
          <div className=" text-light-3">No Threads found</div>
         ): (
          <>
            {result.posts.map((post)=> (
              <ThreadCard 
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                text={post.text}
                author={post.author}
                parentId={post.parentId}
                createdAt={post.createdAt}
                children={post.children}
                community={post.community}

                />
            ))}
          </>
         )}
      </section>
    </div>
  );
}
