
import mongoose from 'mongoose'

const UserSchema=new mongoose.Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    username:{type:String,required:true},
    image:{type:String,required:true},
    bio:{type:String,required:true},
    threads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    }],
    onboarded:{
        type:Boolean,
        default:false
    },
    communities:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Community'
        }
    ]
})

const ThreadUser = mongoose.models.ThreadUser || mongoose.model('ThreadUser', UserSchema);

export default ThreadUser;