
import mongoose from "mongoose";
import ThreadUser from "./User.models";
import Thread from "./Threads.models";

const CommunitySchema=new mongoose.Schema({

    id:{type:String,required:true},
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    bio:{type:String},
    image:{type:String},
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ThreadUser"
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ThreadUser"
        }
    ],
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Thread"
        }
    ]

})

const Community=mongoose.models.Community || mongoose.model('Community',CommunitySchema);

export default Community;

