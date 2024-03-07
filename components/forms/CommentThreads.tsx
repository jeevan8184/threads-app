"use client"

import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { CommentValidation } from "@/lib/validations/User"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { usePathname } from "next/navigation"
import { addCommentToThread } from "@/lib/actions/Thread.action"

interface Props {
    userId:string,
    threadId:string,
    image:string
}

export default function CommentsThread ({userId,threadId,image}:Props) {

    const pathname=usePathname();

    const form=useForm({
        resolver:zodResolver(CommentValidation),
        defaultValues:{
            comment:''
        }
    })

    const onSubmit:any=async(values:z.infer<typeof CommentValidation>)=> {
        
        await addCommentToThread(threadId,values.comment,JSON.parse(userId),pathname);
        form.reset();
    }

    return (
        <Form {...form}>
            <form className=" flex justify-between items-center" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                    name="comment"
                    render={({field})=> (
                        <FormItem className=" w-full flex gap-1 flex-center">
                            <FormLabel>
                                <Image src={image} height={50} width={50} className=" object-contain rounded-full flex-1" alt="image" />
                            </FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="comment..." multiple className=" w-full bg-black text-light-2 mx-4"  />
                            </FormControl>
                        </FormItem>
                    ) }
                >
                </FormField>

                <Button type="submit" className=" bg-blue-500 rounded-full">Reply</Button>
            </form>
        </Form>
    )
}