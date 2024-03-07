"use client"

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { ThreadValidation } from "@/lib/validations/User";
import { z } from "zod";
import { Button } from "../ui/button";
import { createThread } from "@/lib/actions/Thread.action";
import { usePathname, useRouter } from "next/navigation";


function PostThread({userId}:{userId:string}) {
    const pathname=usePathname();
    const router=useRouter();

    const form=useForm({
        resolver:zodResolver(ThreadValidation),
        defaultValues:{
            thread:'',
            accountId:userId
        }
    })

    const onSubmit=async(values:z.infer<typeof ThreadValidation>)=> {

        await createThread({
          text:values.thread,
          author:userId,
          path:pathname
        })
        router.push('/');
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full px-6">
            <FormField
              control={form.control}
              name="thread"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thread</FormLabel>
                  <FormControl>
                    <Textarea {...field}
                        placeholder="create new thread and explore something new..." 
                        rows={6}
                        className=" bg-dark-3 text-white w-full"
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className=" bg-blue-500 w-full">Submit</Button>
          </form>
        </Form>
      )
}

export default PostThread;