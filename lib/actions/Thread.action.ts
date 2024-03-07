"use server"

import { connectToDB } from "../mongoose"
import ThreadUser from "../models/User.models";
import Thread from "../models/Threads.models";
import { revalidatePath } from "next/cache";
import Community from "../models/Community.model";


interface Props {
    text:string,
    author:string,
    communityId:string | null,
    path:string,
}

export async function createThread({text,author,communityId,path}:Props) {
    
    await connectToDB();
    try {
        const communityObject=await Community.findOne({id:communityId},{_id:1});
        const newThread=await Thread.create({
            text,
            author,
            createdAt:new Date().toISOString(),
            community:communityObject._id,
        })
        
        await ThreadUser.findByIdAndUpdate(author,{
            $push:{threads:newThread._id}
        })
        if(communityObject) {
            await Community.findByIdAndUpdate(communityObject._id,{
                $push:{threads:newThread._id}
            })
        }

        revalidatePath(path);
    } catch (error:any) {
        throw new Error(`failed to createThread ${error.message}`);
    }
}

export async function fetchPosts(pageNumber=1,pageSize=10) {

    try {
        await connectToDB();
        const skipAmt=(Number(pageNumber)-1)*pageSize;

        const postsQuery= Thread.find({parentId:{$in:[null,undefined]}})
            .sort({createdAt:'desc'})
            .limit(pageSize)
            .skip(skipAmt)
            .populate({path:'author',model:'ThreadUser'})
            .populate({path:'community',model:Community})
            .populate({
                path:'children',  
                populate:{
                    path:'author',
                    model:'ThreadUser',
                    select:'_id name image parentId'
                }
            })
            const totalDocs=await Thread.countDocuments({parentId:{$in:[null,undefined]}});
            const posts=await postsQuery.exec();
            const isNext=totalDocs>posts.length+skipAmt;

            return {posts,isNext};

    } catch (error:any) {
        throw new Error(`failed to fetchPosts ${error.message}`);
    }
}

export async function fetchThreadById(id:string) {

    try {
        await connectToDB();

        const thread=await Thread.findById(id)
            .populate({path:'author',model:ThreadUser,select:'_id id name image'})
            .populate({path:'community',model:Community})
            .populate({
                path:'children',
                populate:[
                    {
                        path:'author',
                        model:ThreadUser,
                        select:'_id id name image'
                    },
                    {
                        path:'children',
                        model:Thread,
                        populate:{
                            path:'author',
                            model:ThreadUser,
                            select:'_id id name image'
                        }
                    }
                ]
            }).exec();

        return thread;

    } catch (error:any) {
        throw new Error(`Failed to fetchThreadById ${error.message}`);
    }
}

export async function addCommentToThread(threadId:string,commentText:string,userId:string,path:string) {

    try {
        await connectToDB();

        const originalThread=await Thread.findById(threadId);
        if(!originalThread) throw new Error(' No comment threads found');
        const newThread=new Thread(
            {
                text:commentText,
                parentId:threadId,
                author:userId,
                createdAt:new Date().toISOString(),
            }
        )
        const saveThread=await newThread.save();

        originalThread.children.push(saveThread._id);

        await originalThread.save();
        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Failed to add comment ${error.message}`);
    }
}

async function fetchAllChildThreads(threadId:string):Promise<any[]> {

    const childThreads=await Thread.find({parentId:threadId});
    
    const allThreads=[];
    for(const childThread of childThreads) {
        const threads=await fetchAllChildThreads(childThread._id);
        allThreads.push(childThread, ...threads);
    }
    return allThreads;
} 

export default async function deleteThread(id:string,path:string) {

    try {
        await connectToDB();

        const mainThread=await Thread.findById(id);

        if(!mainThread) throw new Error('Thread not found..');

        const descendantThreads=await fetchAllChildThreads(id);

        const descendantThreadIds=[
            ...descendantThreads.map((thread)=> thread._id ),
            id
        ]

        const AuthorIds=new Set([
            ...descendantThreads.map((thread)=> thread.author?._id ),
            mainThread.author._id
        ].filter((id)=> id !==undefined) )
        
        const communityIds=new Set([
            ...descendantThreads.map((thread)=> thread.community?._id),
            mainThread.community?._id
        ])
        
        await Thread.deleteMany({_id:descendantThreadIds});

        //update ThreadUser
        await ThreadUser.updateMany(
            {_id:{$in:Array.from(AuthorIds)}},
            {threads:{$pull:descendantThreadIds}}
        )

        //update Community
        await Community.updateMany(
            {_id:{$in:Array.from(communityIds)}},
            {threads:{$pull:descendantThreadIds}}
        )

        revalidatePath(path);
        
    } catch (error) {
        throw new Error(`Failed to deleteThread ${error}`);
    }
}
