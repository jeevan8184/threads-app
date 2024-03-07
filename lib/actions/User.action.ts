"use server"

import ThreadUser from "../models/User.models";
import Thread from "../models/Threads.models";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/Community.model";

interface Props {
    userId:string,
    username:string,
    name:string,
    image:string,
    bio:string,
    path:string,
}

export async function UpdateUser({
    userId,
    username,
    name,
    image,
    bio,
    path
}:Props) {
    await connectToDB();

    try {

        await ThreadUser.findOneAndUpdate(
            {id:userId},
            {
                username:username.toLowerCase(),
                name,
                image,
                bio,
                onboarded:true
            },
            {upsert:true}
        )
        if(path==='/profile/edit') {
            revalidatePath(path);
        }

    } catch (error:any) {
        throw new Error(`Failed to update ${error.message}`)
    }
}

export async function fetchUser(userId:string) {

    await connectToDB();
    try {
        return await ThreadUser.findOne({id:userId}).populate({path:'communities',model:Community});
    } catch (error:any) {
        throw new Error(`Failed to fetchUSer ${error.message}`);
    }
}

export async function fetchUserPosts(accountId:string) {

    try {
        await connectToDB();
        const posts=await ThreadUser.findOne({id:accountId})
            .populate({
                path:'threads',
                model:Thread,
                populate:[
                    {
                        path:'communities',
                        model:Community,
                        select:'_id id name image'
                    },
                    {
                        path:'children',
                        model:Thread,
                        populate:{
                            path:'author',
                            model:ThreadUser,
                            select:'name image id'
                        }
                    }
                ]
            })
        console.log('posts',posts);
        return posts;

    } catch (error:any) {
        throw new Error(`Failed to fetchUSer ${error.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchTerm="",
    pageNumber=1,
    pageSize=10,
    sortBy='desc'

}:{
    userId:string,
    searchTerm:string,
    pageNumber:number,
    pageSize:number,
    sortBy:SortOrder

}) {

    try {
        await connectToDB();
        const skipAmt=(Number(pageNumber)-1)*pageSize;
        const regex=new RegExp(searchTerm,"i");

        const query:FilterQuery<typeof ThreadUser>={
            id:{$ne:userId}
        }

        if(searchTerm.trim() !=="") {
            query.$or=[
                {username:{$regex:regex}},
                {name:{$regex:regex}}
            ]
        }
        
        const users= ThreadUser.find(query)
            .limit(pageSize)
            .skip(skipAmt)
            .sort({createdAt:sortBy})

        const newUsers=await users.exec();
        const totalDocs=await ThreadUser.countDocuments(query);
        const isNext=totalDocs>skipAmt+newUsers.length;

        return {newUsers,isNext};

    } catch (error:any) {
        throw new Error(`failed to fetchUsers ${error.message}`);
    }
}

export async function getActivity(userId:string) {

    try {
        await connectToDB();
        
        const threads=await Thread.find({author:userId});

        const childThreadIds=threads.reduce((acc,userThread)=> {
            return acc.concat(userThread.children);
        },[]);

        const replies=await Thread.find({
            _id:{$in:childThreadIds},
            author:{$ne:userId},
        })
        .populate({
            path:'author',
            model:ThreadUser,
            select:'name image id '
        });
        
        return replies;
    } catch (error:any) {
        throw new Error(`Failed to getActivity ${error.message}`);
    }
}