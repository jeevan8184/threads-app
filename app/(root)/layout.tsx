import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import Leftsidebar from "@/components/shared/Leftsidebar";
import Rightsidebar from "@/components/shared/Rightsidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads App",
  description: "creating new Threads App",
  icons:{
    icon:'/assets/heart-filled.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className=" flex flex-row w-full">
            <Leftsidebar />
             {/* <section className=""> */}
              <div className=" flex-start main-container max-w-4xl flex flex-col relative pt-20 pl-10 max-md:pl-4  bg-black text-white min-h-screen">
                  {children}
              </div>
             {/* </section> */}
             <Rightsidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
