import Image from "next/image"
import Link from "next/link"


interface Props {
    userId:string,
    name:string,
    username:string,
    image:string,
    personType:string
}


export default function UserCard({ userId ,name ,username ,image ,personType }:Props) {

    return (
            <div className=" flex-between w-full my-2 text-light-1 ">
                <div className=" p-2 flex gap-2">
                    <Image src={image} alt="image" height={40} width={40} className=" object-contain rounded-full" />
                    <div className=" flex flex-col">
                        <p className="">{name}</p>
                        <p className=" text-neutral-400 text-sm ">@{username}</p>
                    </div>
                </div>
                <Link href={`/profile/${userId}`} className=" rounded-full px-4 py-1.5 bg-blue-500 text-light-1">
                    <p className="">View</p>
                </Link>
            </div>
    )
}
