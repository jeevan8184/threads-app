"use server"

import ProfileHeader from "@/components/cards/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/User.action";
import { currentUser } from "@clerk/nextjs"
import Image from "next/image";



export default async function Page({params}:{params:{id:string}}) {
    
    const user=await currentUser();
    if(!user) return null;
    const userInfo=await fetchUser(params.id);

    return (
        <div className=" text-light-1 w-full pr-3 mb-36">
            <ProfileHeader
                accountId={userInfo.id}
                userId={user.id}
                name={userInfo.name}
                image={userInfo.image}
                username={userInfo.username}
                bio={userInfo.bio}

            />

            <div className=" w-full my-4 mb-8 ">
                <Tabs defaultValue="threads"  className=" w-full">
                    <TabsList className=" w-full flex flex-row justify-between pr-4 gap-1">
                        {profileTabs.map((tab)=> (
                            <TabsTrigger className=" tab" value={tab.value} key={tab.label}>
                                <Image 
                                    src={tab.icon}
                                    height={24}
                                    width={24}
                                    className=" object-contain"
                                    alt="tab"
                                />
                                <p className="">{tab.label}</p>
                                {tab.value==='threads' && (
                                    <p className=" p-1 bg-dark-3 text-sm rounded-sm px-2 ">{userInfo.threads.length}</p>
                                )}
                            </TabsTrigger>
                        ) )}
                    </TabsList>
                    {profileTabs.map((tab)=> (
                        <TabsContent key={tab.value} value={tab.value} >
                            <ThreadsTab
                                userId={user.id}
                                accountId={userInfo.id}
                                accountType="User"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

        </div>
    )
}
