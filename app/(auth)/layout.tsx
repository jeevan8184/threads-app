
import {ClerkProvider} from '@clerk/nextjs'
import { Metadata } from 'next'
import React from 'react'
import '../globals.css'
import dotenv from "dotenv";

dotenv.config();

export const metadata:Metadata={
    title:' Threads App',
    description:'new way of creating threads',
    icons:{
      icon:'/assets/heart-filled.svg'
    }
}

export default function RootLayout ({children}:Readonly<{children:React.ReactNode}>) {
        
  return (
    <ClerkProvider>
        <html lang='eng'>
            <body className=' relative items-center'>
                <main className=' flex-center'>
                  {children}
                </main>
            </body>
        </html>
    </ClerkProvider>
  )
}
