"use client"

import React, { ChangeEvent, useState } from 'react'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Uservalidation } from '@/lib/validations/User'
import Image from 'next/image'
import { Textarea } from '../ui/textarea'
import { useUploadThing } from '@/lib/uploadthing'
import { isBase64Image } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { UpdateUser } from '@/lib/actions/User.action'

interface Props {
    user:{
        id:string,
        username:string,
        name:string,
        bio:string,
        image:string
    },
    btnTitle:string
}

const AccountProfile = ({user,btnTitle}:Props) => {
    const router=useRouter();
    const pathname=usePathname();
    const {startUpload}=useUploadThing("media");

    const [files, setFiles] = useState<File[]>([]);

    const form=useForm<z.infer<typeof Uservalidation>>({
        resolver:zodResolver(Uservalidation),
        defaultValues:{
            profile_photo:user?.image || '',
            name:user?.name ||  '',
            username:user?.username || '',
            bio:user?.bio || ''
        }
    })

    const handleImage=(e:ChangeEvent<HTMLInputElement>,fieldChange:(value:string)=>void)=> {
        e.preventDefault();

        const fileReader=new FileReader();

        if(e.target.files && e.target.files.length>0) {
            console.log('file',e.target.files);
            const file=e.target.files[0];
            setFiles(Array.from(e.target.files));

            if(!file.type.includes('image')) return;

            fileReader.readAsDataURL(file);

            fileReader.onload=async(event)=> {
                console.log('event',event);
                const imgDataUrl=await event?.target?.result?.toString() || "";
                fieldChange(imgDataUrl);
            }
        }
    }

    async function onSubmit(values:z.infer<typeof Uservalidation >) {
        const blob=values.profile_photo;
        console.log('blob',blob)
        const isImage=isBase64Image(blob);
        if(isImage) {
            console.log('isImage');
            const imgRes=await startUpload(files);

            if(imgRes && imgRes[0].url) {
                console.log('imgRes',imgRes);
                console.log('files',files);
                values.profile_photo=imgRes[0].url;
            }
        }
        //to do update by backend

        await UpdateUser({
            userId:user.id,
            username:values.username,
            name:values.name,
            image:values.profile_photo,
            bio:values.bio,
            path:pathname
        })

        console.log('updated')

        if(pathname==='/profile/edit') {
            router.back();
        }else {
            router.push('/');
        }
    }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=' text-light-1'>
            <FormField
                control={form.control}
                name='profile_photo'
                render={({field})=> (
                    <FormItem className='flex text-light-1 flex-row'>
                        <FormLabel className=' bg-dark-2 text-white form_img border-none'>
                            {field.value ? (
                                <Image 
                                    src={field.value}
                                    alt='profile_photo'
                                    height={96}
                                    width={96}
                                    className=' rounded-full object-contain'
                                />
                            ) : (
                                <Image 
                                src="/assets/profile.svg"
                                alt='profile_photo'
                                height={24}
                                width={24}
                                className='  object-contain'
                            />
                            )}
                        </FormLabel>
                        <FormControl>    
                            <Input
                                placeholder='upload a photo'
                                onChange={(e)=> handleImage(e,field.onChange)}
                                className='input_img'
                                
                                type='file'
                                accept='image/*'
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name='name' 
                render={({field})=> (      
                    <FormItem className=' flex flex-col mt-3 '>
                        <FormLabel>name</FormLabel>
                        <FormControl>
                            <Input
                               {...field}
                               className='bg-black text-light-1'
                               type='text'
                               autoFocus
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name='username'
                render={({field})=> (
                    <FormItem className=' flex flex-col mt-3'>
                        <FormLabel>username</FormLabel>
                        <FormControl>
                            <Input
                               {...field}
                               className='bg-black text-light-1'
                               type='text'
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name='bio'
                render={({field})=> (
                    <FormItem className=' flex flex-col mt-3'>
                        <FormLabel>bio</FormLabel>
                        <FormControl>
                            <Textarea
                               {...field}
                               className=' bg-black text-light-1'
                               rows={5}
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type='submit' className=' bg-blue-500 text-light-1 w-full mt-2'>submit</Button>
        </form>
    </Form>
  )
}

export default AccountProfile;