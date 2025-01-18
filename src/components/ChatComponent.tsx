// "use client";
// import React from "react";
// import { Input } from "./ui/input";
// import { useChat } from "ai/react";
// import { Button } from "./ui/button";
// import { Send } from "lucide-react";
// import MessageList from "./MessageList";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { Message } from "ai";

// type Props = { chatId: number };

// const ChatComponent = ({ chatId }: Props) => {
//   const { data, isLoading } = useQuery({
//     queryKey: ["chat", chatId],
//     queryFn: async () => {
//       const response = await axios.post<Message[]>("/api/get-messages", {
//         chatId,
//       });
//       return response.data;
//     },
//   });

//   const { input, handleInputChange, handleSubmit, messages } = useChat({
//     api: "/api/chat",
//     body: {
//       chatId,
//     },
//     initialMessages: data || [],
//   });
//   React.useEffect(() => {
//     const messageContainer = document.getElementById("message-container");
//     if (messageContainer) {
//       messageContainer.scrollTo({
//         top: messageContainer.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);
//   return (
//     <div className="relative flex flex-col h-full" id="message-container">
//       {/* header */}
//       <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit z-10">
//         <h3 className="text-xl font-bold">Chat</h3>
//       </div>
  
//       {/* message list */}
//       <div className="flex-1 overflow-y-auto">
//         <MessageList messages={messages} isLoading={isLoading} />
//       </div>
  
//       <form
//         onSubmit={handleSubmit}
//         className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
//       >
//         <div className="flex">
//           <Input
//             value={input}
//             onChange={handleInputChange}
//             placeholder="Ask any question..."
//             className="w-full"
//           />
//           <Button className="bg-blue-600 ml-2">
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
  
// };

// export default ChatComponent;



"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Select } from "./ui/select"; // Import Select component

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const [selectedModel, setSelectedModel] = useState("gemini"); // State to manage selected model
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
      model: selectedModel, // Pass the selected model to the backend
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="relative flex flex-col h-full" id="message-container">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit z-10">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Model Selection */}
      <div className="p-2 bg-blue-200">
        <Select
          id="model"
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full"
        >
          <option value="gemini">Gemini</option>
          <option value="custom-small">Custom Small</option>
          <option value="custom-big">Custom Big</option>
        </Select>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-2">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
