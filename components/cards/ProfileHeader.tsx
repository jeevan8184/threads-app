import Image from "next/image"

interface Props {
    accountId:string,
    userId:string,
    name:string,
    image:string,
    username:string,
    bio:string
}

export default async function ProfileHeader({
    accountId,
    userId,
    name,
    image,
    username,
    bio
}:Props) {

    return (

        <div className=" flex-col my-2 px-4">
            <h1 className=" text-light-1 text-2xl font-extrabold mb-3">Profile </h1>
            <div className="flex flex-col gap-3">
                <Image src={image} height={240} width={240} className=" object-contain rounded-xl" alt="profile" />
                <div className=" flex flex-col flex-start text-light-1" >
                    <p className=" font-semibold text-xl">{name}</p>
                    <p className=" text-sm">@{username}</p>
                </div>
                <div className=" flex flex-wrap text-neutral-300 text-[14px]">{bio}</div>
            </div>
        </div>
    )
}