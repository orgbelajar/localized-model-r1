// //import { Menu } from "lucide-react";
// import { useLayoutEffect, useRef, useState } from "react";
// import { ChatMessage } from "~/components/ChatMessage";
// import { Button } from "~/components/ui/button";
// import { Textarea } from "~/components/ui/textarea";
// // import ollama from "ollama";
// // import { ThoughtMessage } from "~/components/ThoughtMessage";
// import { db } from "~/lib/dexie";
// import { useParams } from "react-router";
// import { useLiveQuery } from "dexie-react-hooks";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Inisialisasi Gemini API
// const genAI = new GoogleGenerativeAI("AIzaSyAQYeyP6iR68ZWDRrmEHsZ3JZDAL2R1fAg"); // Ganti dengan API key Anda
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const ChatPage = () => {
//   const [messageInput, setMessageInput] = useState("");
//   const [streamedMessage, setStreamedMessage] = useState("");

//   const scrollToBottomRef = useRef<HTMLDivElement>(null);

//   const params = useParams(); //dari dynamic routing

//   const messages = useLiveQuery(
//     () => db.getMessageForThread(params.threadId as string),
//     [params.threadId]
//   );

//   const handleSubmit = async () => {
//     // buat message user
//     await db.createMessage({
//       content: messageInput,
//       role: "user",
//       thought: "",
//       thread_id: params.threadId as string,
//     });

//     // Kirim permintaan ke Gemini API
//     const prompt = messageInput.trim();
//     const result = await model.generateContentStream(prompt);

//     setMessageInput("");

//     let fullContent = "";
//     // Proses respons streaming dari Gemini
//     for await (const chunk of result.stream) {
//       const chunkText = chunk.text();
//       fullContent += chunkText;
//       setStreamedMessage(fullContent);
//     }

//     await db.createMessage({
//       content: fullContent,
//       role: "assistant",
//       thought: "",
//       thread_id: params.threadId as string,
//     });

//     setStreamedMessage("");
//   };

//   /* akan scroll ke bawah sampai browser menemukan div ref={scrollToBottomRef} */
//   const handleScrollToBottom = () => {
//     scrollToBottomRef.current?.scrollIntoView();
//   };

//   useLayoutEffect(() => {
//     handleScrollToBottom();
//   }, [streamedMessage, messages]);


//   return (
//     <div className="flex flex-col flex-1">
//       <header className="flex items-center px-4 h-16 border-b">
//         <h1 className="text-xl font-bold ml-4">PUSINFOLAHTA TNI AI</h1>
//       </header>
//       <main className="flex-1 overflow-auto p-4 w-full">
//         <div className="mx-auto space-y-4 pb-20 max-w-screen-md">
//           {messages?.map((message, index) => (
//             <ChatMessage
//               key={index}
//               role={message.role}
//               content={message.content}
//               thought={message.thought}
//             />
//           ))}

//           {!!streamedMessage && (
//             <ChatMessage role="assistant" content={streamedMessage} />
//           )}

//           <div ref={scrollToBottomRef}></div>
//         </div>
//       </main>
//       <footer className="border-t p-4">
//         <div className="max-w-3xl mx-auto flex gap-2">
//           <Textarea
//             className="flex-1"
//             placeholder="Ketik pertanyaan anda disini..."
//             rows={5}
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//           />
//           <Button onClick={handleSubmit} type="button">
//             Kirim
//           </Button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default ChatPage;
