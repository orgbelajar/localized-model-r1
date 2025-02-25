import { Menu } from "lucide-react";
import { useState } from "react";
import { ChatMessage } from "~/components/ChatMessage";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import ollama from "ollama";
import { ThoughtMessage } from "~/components/ThoughtMessage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const chatHistory: Message[] = [
  { role: "assistant", content: "Hello! How can I assist you today?" },
  { role: "user", content: "Can you explain what React is?" },
  {
    role: "assistant",
    content:
      "React is a popular JavaScript library for building user interfaces. It was developed by Facebook and is widely used for creating interactive, efficient, and reusable UI components. React uses a virtual DOM (Document Object Model) to improve performance by minimizing direct manipulation of the actual DOM. It also introduces JSX, a syntax extension that allows you to write HTML-like code within JavaScript.",
  },
];

const ChatPage = () => {
  const [messageInput, setMessageInput] = useState("");
  const [streamedMessage, setStreamedMessage] = useState("");
  const [streamedThought, setStreamedThought] = useState("");

  const handleSubmit = async () => {
    alert("chat");

    const stream = await ollama.chat({
      model: "deepseek-r1:7b",
      messages: [
        {
          role: "user",
          content: messageInput.trim(),
        },
      ],
      stream: true, //mengirim perbagian
    });

    let fullContent = "";
    let fullThought = "";

    /**
     * mode thought (think)
     * mode jawab (message)
     * parameter finish think ketika bertemu tag </think>
     */
    let outputMode: "think" | "message" = "think"; //defaultnya think

    for await (const part of stream) {
      const messageContent = part.message.content;

      if (outputMode === "think") {
        if (
          !(
            messageContent.includes("<think>") ||
            messageContent.includes("</think>")
          )
        ) {
          fullThought += messageContent;
        }

        setStreamedThought(fullThought);

        if (messageContent.includes("</think>")) {
          outputMode = "message";
        }
      } else {
        fullContent += messageContent;
        setStreamedMessage(fullContent);
      }

      // fullContent += messageContent;
      // setStreamedMessage(fullContent);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center px-4 h-16 border-b">
        <h1 className="text-xl font-bold ml-4">AI Chat Dashboard</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 w-full">
        <div className="mx-auto space-y-4 pb-20 max-w-screen-md">
          {chatHistory.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}

          {!!streamedThought && <ThoughtMessage thought={streamedThought} />}

          {!!streamedMessage && (
            <ChatMessage role="assistant" content={streamedMessage} />
          )}
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
          />
          <Button onClick={handleSubmit} type="button">
            Kirim
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
