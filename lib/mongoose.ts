
import mongoose from 'mongoose';

let isConnected=false;

export const connectToDB=async()=> {

    if(!process.env.NEXT_PUBLIC_MONGODB_URL) return console.log("mongodb url not found");
    if(isConnected) return console.log("mongodb connected");
    const connection=process.env.NEXT_PUBLIC_MONGODB_URL
    try {
        await mongoose.connect(`${connection}`,{
            dbName:'newThreads_123'
        });
        isConnected=true;
        console.log('mongodb connected');
    } catch (error) {
     console.log(error);
    }
}
