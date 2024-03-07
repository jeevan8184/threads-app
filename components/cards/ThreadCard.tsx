

import Image from "next/image"
import moment from 'moment';
import Link from "next/link";

interface Props {
    id:string,
    text:string,
    currentUserId:string,
    author:{
        id:string,
        name:string,
        image:string,
    },
    parentId:string,
    createdAt:string,
    children:{
        author:{
            image:string,
        }
    }[],
    community:string,
    isComment?:boolean
}

export default async function ThreadCard({id,currentUserId,text,author,parentId,createdAt,children,community,isComment}:Props) {
    
    return (
    <div className=" sm:mt-4 mt-2 rounded-2xl border border-light-3 p-6 py-3 pb-2 w-full flex-col">
        <div className=" flex flex-col gap-3">
            <div className=" flex gap-3">
                <div className=" flex flex-col items-center">
                  <Link href={`/profile/${author.id}`}>
                  <Image 
                    src={author.image}
                    height={40}
                    width={40}
                    alt="image"
                    className=" rounded-full object-contain"
                  />
                  </Link>
                </div>
                <div className=" flex flex-col">
                    <Link href={`/profile/${author.id}`} className=" cursor-pointer">
                        <p className=" font-semibold">{author.name}</p>
                    </Link>
                    <p className=" text-gray-400 text-sm">{moment(createdAt).fromNow()}</p>

                </div>
            </div>
            <p className=" text-sm text-light-1 ">{text}</p>
            <div className=" flex gap-2">
                <Image 
                    src='/assets/heart-gray.svg'
                    alt="heart-gray"
                    height={24}
                    width={24}
                    className=" object-contain  cursor-pointer"
                />
                <Link href={`/thread/${id}`}>
                  <Image 
                    src='/assets/reply.svg'
                    alt="heart-gray"
                    height={24}
                    width={24}
                    className=" object-contain cursor-pointer"
                  />
                </Link>
                <Image 
                    src='/assets/share.svg'
                    alt="heart-gray"
                    height={24}
                    width={24}
                    className=" object-contain cursor-pointer"
                />
                <Image 
                    src='/assets/repost.svg'
                    alt="heart-gray"
                    height={24}
                    width={24}
                    className=" object-contain cursor-pointer"
                />
            </div>
        </div>
    </div>
    )
}
