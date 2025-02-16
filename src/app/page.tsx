import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Bold, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";

import { db } from "@/lib/db";
import { chatGroups, chats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";





export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

// greatest id chat of the user 
let greatestChatId = null;

if (isAuth) {
  // Fetch the greatest chat ID for the authenticated user
  const greatestChat = await db
    .select()
    .from(chatGroups)
    .where(eq(chatGroups.userId, userId))
    .orderBy(desc(chatGroups.id))
    .limit(1);

  if (greatestChat.length > 0) {
    greatestChatId = greatestChat[0].id;
  }
}

// ----------------------

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-400 to-red-400 text-white">
      
      {/* Navbar */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-300 via-blue-600 to-red-600 shadow-md">
        
        {/* Left-aligned logo and text */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <img
              src="/ProfilePicturePhoto.png" // Update this path to your logo's actual path
              alt="NLL Logo"
              className="w-12 h-12" // Logo size for the navbar
            />
          </Link>
          <span className="text-lg font-semibold text-white">
            LeapBuddy | Chat Assistant for New Leap Labs
          </span>
        </div>
        
        {/* Right-aligned navigation items */}
        <nav className="flex items-center space-x-4">
          {isAuth ? (
            <Link href="https://kjsit.somaiya.edu.in/en/view-announcement/552/">
              <Button variant="ghost" className="text-white text-lg">
                Visit <span className="font-bold">New Leap Labs</span>
              </Button>
            </Link>
          ) : (
            <Link href="/">
  <Button variant="ghost" className="text-white">
    We <span className="font-bold">Believe</span>
  </Button>
</Link>
          )}
          <UserButton afterSignOutUrl="/" />
        </nav>
      </header>

      {/* Main Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row  items-center ">
          
         
          
          <div className="flex flex-col mr-10 pr-4 items-left tet-left">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl text-black font-semibold">LeapBuddy</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          

          {/* Go to chats section with some modifications */}
          
        
          <div className="flex mt-2 border-2 border-white m-auto ml-0 bg-black p-1 ">
            {isAuth && greatestChatId ? (
              <Link href={`/chat/${greatestChatId}`}>
                <Button>Go to Chats</Button>
              </Link>
            ) : (
              <p className="text-sm text-gray-300">No chats available</p>
            )}
          </div>
          
          <p className="max-w-xl mt-1 text-lg text-black text-slate-300">
            Handle all your documentation references, research queries, and planner's blocks with ease. LeapBuddy is your answer to all kinds of queries.
          </p>

          <div className="w-80 mt-4 mr-0">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          </div>

           {/* Logo Section */}
           
           <img
            src="/ProfilePicturePhoto.png" // Update this path to your logo's actual path
            alt="NLL Logo"
            className="w-64 h-auto mb-4" // Adjust width as needed
          />
        </div>
      </div>
    </div>
  );
}
