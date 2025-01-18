import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const { pdfName } = await req.json();
    const chatId = parseInt(params.chatId, 10);

    if (!pdfName || !chatId) {
      return new Response("Invalid request", { status: 400 });
    }

    await db.update(chats).set({ pdfName }).where(eq(chats.id, chatId));

    return new Response("Chat name updated successfully!", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error updating chat name", { status: 500 });
  }
};



  export async function DELETE(req: Request, { params }: { params: { chatId: string } }) {
    try {
      
      const chatId = parseInt(params.chatId, 10);
      
  
      if (!chatId) {
        return new Response("Invalid request", { status: 400 });
      }
  
      await db.delete(chats).where(eq(chats.id, chatId));
      console.log("Chat deleted successfully");
  
      return new Response("Chat deleted successfully!", { status: 200 });
    } catch (error) {
      console.error("Error deleting chat:", error);
      return new Response("Error deleting chat", { status: 500 });
    }
  };
  
  