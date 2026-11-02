import { useState } from 'react';

interface ChatFormProps {
  onSendMessage: (message: string) => void;
}

export default function ChatForm({ onSendMessage }: ChatFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask a legal question..."
        className="w-full p-3 border rounded-lg"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}
