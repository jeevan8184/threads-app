import UserCard from "@/components/cards/UserCard";
import { fetchUsers } from "@/lib/actions/User.action";
import { currentUser } from "@clerk/nextjs"


export default async function Page () {

    const user=await currentUser();
    if(!user) return null;

    const result=await fetchUsers({
        userId:user.id,
        searchTerm:"",
        pageNumber:1,
        pageSize:10,
        sortBy:'desc'
    })

    return (
        <div className=" text-white my-2 pr-3 w-full mb-36">
            <div className=" w-full">
                <h1 className=" text-xl font-extrabold ">Search Users</h1>
                {/* searchbar */}
                <div className=" w-full">
                    {result.newUsers.map((newUser)=> (
                        <UserCard
                            key={newUser.id}
                            userId={newUser.id}
                            name={newUser.name}
                            username={newUser.username}
                            image={newUser.image}
                            personType="User"
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}