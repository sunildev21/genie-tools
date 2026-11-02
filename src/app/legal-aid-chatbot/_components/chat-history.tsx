interface ChatHistoryProps {
    messages: { role: string; content: string }[];
  }
  
  export default function ChatHistory({ messages }: ChatHistoryProps) {
    return (
      <div className="p-4 bg-gray-50 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">Chat History</h2>
        {messages.length === 0 ? (
          <p>No previous chats</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded ${
                msg.role === "user" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>
    );
  }
  