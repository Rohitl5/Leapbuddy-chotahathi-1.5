// import {GoogleGenerativeAI,} from "@google/generative-ai";
// import { GoogleGenerativeAIStream,StreamingTextResponse } from "ai";
// import { db } from "@/lib/db";
// import { chats, messages as _messages } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";
// import { getContext } from "@/lib/context";

// export const runtime="edge";

// const genai= new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req:Request){
//     try {
//         const {messages, chatId}=await req.json();
//         const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
//         if (_chats.length != 1) {
//             return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//           }
//         const fileKey = _chats[0].fileKey;
//         const lastMessage = messages[messages.length - 1];
//         const context = await getContext(lastMessage.content, fileKey);
//         console.log(`${context}`);
        
//         let prompt=`
//         Your name is LeapBuddy.
//         You are a Retrieval Augmented Generation (RAG) based chatbot, which retrieves information from pdfs uploaded by user.
//         You are in a conversation with a user who has uploaded a pdf file.
//         The user has asked you to ${lastMessage.content}.
//         You need to refer the pdf and retrieve the most relevant knowledge from it, and combine it with your global knowledge, to frame a suitable answer fro the user's question.
//         START CONTEXT BLOCK
//         ${context}
//         END OF CONTEXT BLOCK
//         START HISTORY BLOCK`
//         for(let i=0;i<messages.length-1;i++){
//             prompt+=`${messages[i].role}: ${messages[i].content}\n`;
//         }
//         prompt+=`END OF HISTORY BLOCK
//         Respond to this considering given history:${lastMessage.content}\n`;
            
//         const generationConfig = {
//             temperature: 0.5,
//             topK: 3,
//             maxOutputTokens:5000,
//         };
//         const response=await genai
//             .getGenerativeModel({model:"gemini-pro",generationConfig})
//             .generateContentStream(prompt);
//         const stream=GoogleGenerativeAIStream(response, {
//             onStart: async () => {
//                 await db.insert(_messages).values({
//                     chatId,
//                     content: lastMessage.content,
//                     role:'user',
//                 });
//             },
//             onCompletion: async (completion) =>{
//                 await db.insert(_messages).values({
//                   chatId,
//                   content: completion,
//                   role: 'system',
//                 });
//             },
//         });
//          console.log(prompt)
//         return new StreamingTextResponse(stream)
//     } catch (error) {
//         console.error(error)
//     }
// }

import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     try {
//         const { messages, chatId } = await req.json();

//         // Validate the input
//         if (!chatId || !Array.isArray(messages) || messages.length === 0) {
//             return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
//         }

//         // Verify the chat ID exists
//         const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
//         if (_chats.length !== 1) {
//             return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//         }


//         // --------------------------------Trial and error section--------------------------- //
// // method 1----------------->

//         // Extract fileKey and last message
//         const fileKey = _chats[0].fileKey;
//         const lastMessage = messages[messages.length - 1];

//         // Generate context for the conversation
//         const context = await getContext(lastMessage.content, fileKey) || "No relevant context found.";
//         console.log(context);
//         // Build the prompt
//         let prompt = `
//         Your name is LeapBuddy.
//         You are a Retrieval Augmented Generation (RAG) based chatbot, which retrieves information from PDFs uploaded by the user.
//         You are in a conversation with a user who has uploaded a PDF file.
//         The user has asked you to ${lastMessage.content}.
//         You need to refer to the PDF and retrieve the most relevant knowledge from it, and combine it with your global knowledge to frame a suitable answer for the user's question.
//         START CONTEXT BLOCK
//         ${context}
//         END OF CONTEXT BLOCK
//         START HISTORY BLOCK
//         `;


//         for (let i = 0; i < messages.length - 1; i++) {
//             prompt += `${messages[i].role}: ${messages[i].content}\n`;
//         }

//         prompt += `END OF HISTORY BLOCK
//         Respond to this considering the given history: ${lastMessage.content}\n`;



//         // Call the local Node.js server
//         const controller = new AbortController();
//         const timeout = setTimeout(() => controller.abort(), 10000); // 10-second timeout

//         let generatedResponse;
//         try {
//             const response = await fetch("http://localhost:3000/generate", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ prompt }),
//                 signal: controller.signal,
//             });
//             clearTimeout(timeout);

//             if (!response.ok) {
//                 console.error("Error calling the custom model backend:", await response.text());
//                 return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
//             }

//             const jsonResponse = await response.json();
//             generatedResponse = jsonResponse.response;

//             if (!generatedResponse) {
//                 throw new Error("Invalid response format from backend");
//             }
//         } catch (error) {
//             clearTimeout(timeout);
//             console.error("Fetch failed:", error);
//             return NextResponse.json({ error: "Failed to fetch response from backend" }, { status: 500 });
//         }

//         // Log and store the user's and system's messages in the database
//         await db.insert(_messages).values({
//             chatId,
//             content: lastMessage.content,
//             role: "user",
//         });

//         await db.insert(_messages).values({
//             chatId,
//             content: generatedResponse,
//             role: "system",
//         });

//         // Return the generated response
//         return NextResponse.json({ response: generatedResponse });

//     } catch (error) {
//         console.error("Internal server error:", {
//             message: error.message,
//             stack: error.stack,
//         });
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }




export async function POST(req:Request){
    try {
        const {messages, chatId}=await req.json();
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
        console.log("Received data:", { messages, chatId }); //log1
        if (_chats.length != 1) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
          }
        console.log("Chat query result:", _chats); //log2
        const fileKey = _chats[0].fileKey;
        const lastMessage = messages[messages.length - 1];
        const context = await getContext(lastMessage.content, fileKey);
        console.log(`${context}`);
        

        // the prompt was considerably reduced as the model currently only
        // handles 512 tokes but here contxt exceeds the limits 
        let prompt=`
        Your name is LeapBuddy.
        You are a Retrieval Augmented Generation (RAG) based chatbot, which retrieves information from pdfs uploaded by user.
        You are in a conversation with a user who has uploaded a pdf file.
        The user has asked you to ${lastMessage.content}.
        You need to refer the pdf and retrieve the most relevant knowledge from it, and combine it with your global knowledge, to frame a suitable answer fro the user's question.`
       
        prompt+=`Respond to this considering given history:${lastMessage.content}\n`;
            
        //   Call the local Node.js server
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10-second timeout

        let generatedResponse;
        try {
            const response = await fetch("http://localhost:3000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
                signal: controller.signal,
            });
            clearTimeout(timeout);

            if (!response.ok) {
                console.error("Error calling the custom model backend:", await response.text());
                return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
            }

            const jsonResponse = await response.json();
            generatedResponse = jsonResponse.response;

            if (!generatedResponse) {
                throw new Error("Invalid response format from backend");
            }
        } catch (error) {
            clearTimeout(timeout);
            console.error("Fetch failed:", error);
            return NextResponse.json({ error: "Failed to fetch response from backend" }, { status: 500 });
        }

        // Log and store the user's and system's messages in the database

       
        
        
        await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
        });
        console.log("Inserting user message:", {  //log 3
            chatId,
            content: lastMessage.content,
            role: "user",
        });

        await db.insert(_messages).values({
            chatId,
            content: generatedResponse,
            role: "system",
        });
        console.log("Inserting system message:", {    //log 4
            chatId,
            content: generatedResponse,
            role: "system",
        });

        // Return the generated response
        return NextResponse.json({ response: generatedResponse });

    } catch (error) {
        console.error("Internal server error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
