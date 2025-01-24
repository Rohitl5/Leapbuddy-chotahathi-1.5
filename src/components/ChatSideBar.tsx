// "use client";
// import { chatGroups, DrizzleChat } from "@/lib/db/schema";
// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import Link from "next/link";
// import { MessageCircle, PlusCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// type Props = {
//   chats: DrizzleChat[];
//   chatId: number;
// };

// const ChatSideBar = ({ chats, chatId }: Props) => {
//   const [menuOpen, setMenuOpen] = useState<number | null>(null);

//   // Toggle menu visibility for the three-dot menu
//   const toggleMenu = (chatId: number) => {
//     setMenuOpen((prev) => (prev === chatId ? null : chatId));
//   };

//   // Handle edit function
//   const handleEdit = async (chatId: number, currentName: string) => {
//     const newName = prompt("Enter a new name for the PDF:", currentName);
//     if (newName && newName.trim() !== currentName) {
//       try {
//         const response = await fetch(`/api/chat/${chatId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ pdfName: newName.trim() }),
//         });
//         if (response.ok) {
//           alert("Name updated successfully!");
//           location.reload(); // Refresh the page to reflect changes
//         } else {
//           alert("Failed to update the name.");
//         }
//       } catch (error) {
//         console.error(error);
//         alert("An error occurred while updating the name.");
//       }
//     }
//   };
  
  

//   // Handle delete function
//   const handleDelete = async (chatId: number) => {
//     if (confirm("Are you sure you want to delete this chat?")) {
//       try {
//         const response = await fetch(`/api/chat/${chatId}`, {
//           method: "DELETE",
//         });
//         if (response.ok) {
//           alert("Chat deleted successfully!");
//           // Optionally: Refresh the page or update state
//         } else {
//           alert("Failed to delete the chat.");
//         }
//       } catch (error) {
//         console.error(error);
//         alert("An error occurred while deleting the chat.");
//       }
//     }
//   };
  

//   return (
//     <div className="w-full h-full min-h-screen p-4 text-gray-200 bg-gray-900 flex flex-col">
//       {/* "Create New Chat" button */}
//       <Link href="/">
//         <Button className="w-full border-dashed border-white border">
//           <PlusCircle className="mr-2 w-4 h-4" />
//           Create New Chat
//         </Button>
//       </Link>

//       {/* Chat list */}
//       <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
//         {chats.map((chat) => (
//           <div key={chat.id} className="relative group">
//             <Link href={`/chat/${chat.id}`}>
//               <div
//                 className={cn(
//                   "rounded-lg p-3 text-slate-400 flex items-center justify-between",
//                   {
//                     "bg-blue-600 text-white": chat.id === chatId,
//                     "hover:text-white": chat.id !== chatId,
//                   }
//                 )}
//               >
//                 <div className="flex items-center">
//                   <MessageCircle className="mr-2" />
//                   <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
//                     {chat.pdfName}
//                   </p>
//                 </div>

//                 {/* Three-dot menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => toggleMenu(chat.id)} // Function to toggle menu visibility
//                     className="p-1 rounded-md  overflow-hidden text-slate-400 hover:bg-gray-200"
//                   >
//                     ⋮
//                   </button>

//                   {/* Dropdown menu */}
//                   {menuOpen === chat.id && (
//                     <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg flex flex-col">
//                       <button
//                         onClick={() => handleEdit(chat.id, chat.pdfName)}
//                         className="p-2 hover:bg-gray-200 text-left text-sm"
//                       >
//                         ✏️ Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(chat.id)}
//                         className="p-2 hover:bg-red-200 text-left text-sm"
//                       >
//                         🗑️ Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="mt-1 flex justify-center items-center h-12">
//         <Link href="/">
//           <Button className="w-full border-dashed border-white border">
//             Back To Homepage
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ChatSideBar;


"use client";
import { chatGroups, DrizzleChatGroup } from "@/lib/db/schema";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chatGroups: DrizzleChatGroup[]; // Updated to accept chat group data
  chatGroupId: number; // Active chat group ID
};

const ChatSideBar = ({ chatGroups, chatGroupId }: Props) => {
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Toggle menu visibility for the three-dot menu
  const toggleMenu = (chatGroupId: number) => {
    setMenuOpen((prev) => (prev === chatGroupId ? null : chatGroupId));
  };

  // Handle edit function
  const handleEdit = async (chatGroupId: number, currentName: string) => {
    const newName = prompt("Enter a new name for the group:", currentName);
    if (newName && newName.trim() !== currentName) {
      try {
        const response = await fetch(`/api/chat/${chatGroupId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName.trim() }), // Update the group name
        });
        if (response.ok) {
          alert("Group name updated successfully!");
          location.reload(); // Refresh the page to reflect changes
        } else {
          alert("Failed to update the group name.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the group name.");
      }
    }
  };

  // Handle delete function
  const handleDelete = async (chatGroupId: number) => {
    if (confirm("Are you sure you want to delete this group?")) {
      try {
        const response = await fetch(`/api/chat/${chatGroupId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Group deleted successfully!");
          location.reload(); // Optionally: Refresh the page or update state
        } else {
          alert("Failed to delete the group.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the group.");
      }
    }
  };

  return (
    <div className="w-full h-full min-h-screen p-4 text-gray-200 bg-gray-900 flex flex-col">
      {/* "Create New Chat Group" button */}
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          Create New Group
        </Button>
      </Link>

      {/* Chat group list */}
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
        {chatGroups.map((group) => (
          <div key={group.id} className="relative group">
            <Link href={`/chat/${group.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-slate-400 flex items-center justify-between",
                  {
                    "bg-blue-600 text-white": group.id === chatGroupId,
                    "hover:text-white": group.id !== chatGroupId,
                  }
                )}
              >
                <div className="flex items-center">
                  <MessageCircle className="mr-2" />
                  <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                    {group.name} {/* Display the group name */}
                  </p>
                </div>

                {/* Three-dot menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(group.id)} // Function to toggle menu visibility
                    className="p-1 rounded-md overflow-hidden text-slate-400 hover:bg-gray-200"
                  >
                    ⋮
                  </button>

                  {/* Dropdown menu */}
                  {menuOpen === group.id && (
                    <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg flex flex-col">
                      <button
                        onClick={() => handleEdit(group.id, group.name)}
                        className="p-2 hover:bg-gray-200 text-left text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="p-2 hover:bg-red-200 text-left text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-1 flex justify-center items-center h-12">
        <Link href="/">
          <Button className="w-full border-dashed border-white border">
            Back To Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChatSideBar;
