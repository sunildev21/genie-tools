interface Message {
    role: string;
    content: string;
  }
  
  interface ChatWindowProps {
    messages: Message[];
  }
  
  export default function ChatWindow({ messages }: ChatWindowProps) {
    return (
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg border">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-2 rounded-lg ${
              msg.role === "user" ? "bg-blue-200" : "bg-green-200"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </div>
        ))}
      </div>
    );
  }
  