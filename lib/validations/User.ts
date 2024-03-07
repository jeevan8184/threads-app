
import * as z from 'zod';

export const Uservalidation=z.object({
    name:z.string().min(2,{message:'min 2 chars'}).max(30),
    username:z.string().min(2).max(30),
    profile_photo:z.string().url().nonempty(),
    bio:z.string().min(2).max(200)
})

export const ThreadValidation=z.object({
    thread:z.string().min(3,{message:'min 3 chars'}).nonempty(),
    accountId:z.string()
})


export const CommentValidation=z.object({
    comment:z.string().nonempty().min(3,{message:'min 3 chars'})
})