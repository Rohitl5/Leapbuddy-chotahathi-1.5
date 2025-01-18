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

// _________________________________________________________________________________________________
// |__________________S_E_C_T_I_O_N_2_______________________________________________________________|

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";

export const runtime = "edge";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages, chatId, model } = await req.json(); // Extract model from the request
    console.log("Selected Model:", model); // Log the selected model
    console.log("Chat ID:", chatId); // Log chat ID
    console.log("Messages:", messages); // Log messages

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);
    console.log("Context:", context); // Log context

    let prompt = `
      Your name is LeapBuddy.
      You are a Retrieval Augmented Generation (RAG) based chatbot, which retrieves information from PDFs uploaded by users.
      You are in a conversation with a user who has uploaded a PDF file.
      The user has asked you to ${lastMessage.content}.
      You need to refer to the PDF and retrieve the most relevant knowledge from it, and combine it with your global knowledge, to frame a suitable answer for the user's question.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      START HISTORY BLOCK`;
    for (let i = 0; i < messages.length - 1; i++) {
      prompt += `${messages[i].role}: ${messages[i].content}\n`;
    }
    prompt += `END OF HISTORY BLOCK
    Respond to this considering given history: ${lastMessage.content}\n`;

    console.log("Prompt:", prompt); // Log prompt

    let response;
    if (model === "gemini") {
      const generationConfig = {
        temperature: 0.5,
        topK: 3,
        maxOutputTokens: 5000,
      };
      const geminiResponse = await genai
        .getGenerativeModel({ model: "gemini-pro", generationConfig })
        .generateContentStream(prompt);

      const stream = GoogleGenerativeAIStream(geminiResponse, {
        onStart: async () => {
          await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
          });
        },
        onCompletion: async (completion) => {
          await db.insert(_messages).values({
            chatId,
            content: completion,
            role: "system",
          });
        },
      });

      console.log("Response is being streamed."); // Log streaming response
      return new StreamingTextResponse(stream);
    } else if (model === "custom") {
      // Example for custom model handling
      console.log("Using custom model."); // Log custom model usage
      response = `Custom model response for: ${lastMessage.content}`;
      await db.insert(_messages).values({
        chatId,
        content: lastMessage.content,
        role: "user",
      });
      await db.insert(_messages).values({
        chatId,
        content: response,
        role: "system",
      });
      console.log("Custom Model Response:", response); // Log custom model response
      return NextResponse.json({ completion: response });
    } else {
      return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error:", error); // Log errors
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
