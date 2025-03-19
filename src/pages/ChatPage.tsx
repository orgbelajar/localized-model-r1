import { useLayoutEffect, useRef, useState } from "react";
import { ChatMessage } from "~/components/ChatMessage";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
// import { ThoughtMessage } from "~/components/ThoughtMessage";
import { db } from "~/lib/dexie";
import { useParams } from "react-router";
import { useLiveQuery } from "dexie-react-hooks";

const ChatPage = () => {
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollToBottomRef = useRef<HTMLDivElement>(null);

  const params = useParams(); // Dari dynamic routing

  const messages = useLiveQuery(
    () => db.getMessageForThread(params.threadId as string),
    [params.threadId]
  );

  const handleSubmit = async () => {
    if (!messageInput.trim()) return;

    setIsLoading(true);
    setError(""); // Reset error state

    try {
      // Simpan pesan pengguna ke database lokal
      await db.createMessage({
        content: messageInput,
        role: "user",
        thought: "",
        thread_id: params.threadId as string,
      });

      // Kirim pertanyaan ke backend
      const response = await fetch("http://localhost:3001/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: messageInput }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Terjadi kesalahan saat memproses pertanyaan."
        );
      }

      // Simpan pesan asisten ke database lokal
      await db.createMessage({
        content: data.data,
        role: "assistant",
        thought: "",
        thread_id: params.threadId as string,
      });
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui."
      );
    } finally {
      setIsLoading(false);
      setMessageInput("");
    }
  };

  /* Akan scroll ke bawah sampai browser menemukan div ref={scrollToBottomRef} */
  const handleScrollToBottom = () => {
    scrollToBottomRef.current?.scrollIntoView();
  };

  useLayoutEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center px-4 h-16 border-b">
        <h1 className="text-xl font-bold ml-4">
          AI ENSIKLOPEDIA ALUTSISTA TNI
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 w-full">
        <div className="mx-auto space-y-4 pb-20 max-w-screen-md">
          {messages?.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              thought={message.thought}
            />
          ))}

          {/* Tampilkan pesan error jika ada */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div ref={scrollToBottomRef}></div>
        </div>
      </main>
      <footer className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            className="flex-1"
            placeholder="Ketik pertanyaan anda disini..."
            rows={5}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleSubmit} type="button" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center">
                <span>Memproses...</span>
                {/* Tambahkan spinner */}
                <svg
                  className="animate-spin ml-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Kirim"
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
