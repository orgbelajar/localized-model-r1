import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = (props: ChatMessageProps) => {
  const isAsistant = props.role === "assistant";

  return (
    <div
      className={`flex items-start gap-4 ${
        isAsistant ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div
        className={`rounded-lg p-4 max-w-[80%] ${
          isAsistant ? "bg-secondary" : "bg-primary text-primary-foreground"
        }`}
      >
        <div className={isAsistant ? "prose dark:prose-invert" : ""}>
          <ReactMarkdown>{props.content.trim()}</ReactMarkdown>
        </div>
        {/* <ReactMarkdown className="prose">{props.content.trim()}</ReactMarkdown> */}
      </div>
    </div>
  );
};
