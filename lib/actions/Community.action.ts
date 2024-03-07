

import { connectToDB } from "../mongoose";
import Thread from "../models/Threads.models";
import ThreadUser from "../models/User.models";
import Community from "../models/Community.model";
import { FilterQuery, SortOrder } from "mongoose";


export async function createCommunity(
    id:string,
    name:string,
    username:string,
    image:string,
    bio:string,
    createdById:string,
) {
    
    try {
        await connectToDB();

        const user=await ThreadUser.findOne({id:createdById});

        const community=new Community({
            id,
            name,
            username,
            bio,
            image,
            createdBy:user._id,
        })

        const newCommunity=await community.save();
        user.communities.push(newCommunity._id);
        await user.save();
        
        return newCommunity;
    } catch (error:any) {
        throw new Error(`Failed to createCommunity ${error.message}`);
    }
}

export async function fetchCommunityDetails(id:string) {

    try {
        await connectToDB();

        const communityDetails=await Community.findOne({id})
            .populate('createdBy')
            .populate({
                path:"members",
                model:ThreadUser,
                select:'_id id name username image'

            })
        return communityDetails;

    } catch (error:any) {
        throw new Error(`Failed to fetchCommunityDetails ${error}`);
    }
}

export async function fetchCommunityPosts(id:string) {

    try {
        await connectToDB();

        const communityPost=await Community.findOne({id})
        .populate({
            path:'threads',
            model:Thread,
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
        })

    } catch (error:any) {
        throw new Error(`Failed to fetchCommunityPosts ${error}`);
    }
}

export async function fetchCommunities({
    searchTerm="",
    pageNumber=1,
    pageSize=10,
    sortBy='desc'
}:{
    searchTerm:string,
    pageNumber:number,
    pageSize:number,
    sortBy:SortOrder
}) {

    try {
        await connectToDB();
        const skipAmt=(pageNumber-1)*pageSize;
        
        const regex=new RegExp(searchTerm,"i");

        const query:FilterQuery<typeof Community>={};

        if(searchTerm.trim() !== "") {
           query.$or=[
             {username:{$regex:regex}},
             {name:{$regex:regex}}
           ]
        }

        const newCommunitys= Community.find(query)
            .limit(pageSize)
            .skip(skipAmt)
            .sort({createdAt:sortBy})

        const communitys=await newCommunitys.exec();
        const totalDocs=await Community.countDocuments(query);
        const isNext=totalDocs>skipAmt+communitys.length;

        return {communitys,isNext};

    } catch (error:any) {
        throw new Error(`Failed to fetchCommunities ${error}`);
    }
}

export async function addMemberToCommunity(communityId:string,memberId:string) {

    try {
        await connectToDB();

        const orgCommunity=await Community.findOne({id:communityId});
        if(!orgCommunity) throw new Error('Community not found!.');
        const member=await ThreadUser.findOne({id:memberId});
        if(!member) throw new Error('user not found');

        if(orgCommunity.members.includes(member._id)) throw new Error('user already exists');

        orgCommunity.members.push(member._id);
        await orgCommunity.save();

        member.communities.push(orgCommunity._id);
        await member.save();

        return orgCommunity;

    } catch (error:any) {
        throw new Error(`Failed to addMemberToCommunity ${error}`);
    }
}

export async function removeUserFromCommunity(communityId:string,userId:string) {

    try {
        await connectToDB();

        const orgCommunity=await Community.findOne({id:communityId},{_id:1});
        if(!orgCommunity) throw new Error('Community not found!.');
        const user=await ThreadUser.findOne({id:userId},{_id:1});
        if(!user) throw new Error('user not found');

        await Community.updateOne(
            {_id:orgCommunity._id},
            {$pull:{members:user._id}}
        )

        await ThreadUser.updateOne(
            {_id:user._id},
            {$pull:{communities:orgCommunity._id}}
        )

        return {success:true};

    } catch (error) {
        throw new Error(`Failed to removeUserFromCommunity ${error}`);
    }
}

export async function updateCommunityInfo(
    communityId:string,
    name:string,
    username:string,
    image:string
) {

    try {
        await connectToDB();

        const updatedCommunity=await Community.findOneAndUpdate(
            {id:communityId},
            {name,username,image}
        )
        if(!updatedCommunity) throw new Error('community not found');

        return updatedCommunity;
    } catch (error:any) {
        throw new Error(`Failed to updateCommunityInfo ${error}`);
    }
}


export async function deleteCommunity(communityId:string) {

    try {
        await connectToDB();

        // const community=await Community.findOne({id:communityId});
        // if(!community) throw new Error('community not found with communityId');

        // const deletedCommunity=await Community.findByIdAndDelete(community._id);

        // await Thread.deleteMany({community:community._id})


    } catch (error:any) {
        throw new Error(`Failed to deleteCommunity ${error}`);
    }
}

