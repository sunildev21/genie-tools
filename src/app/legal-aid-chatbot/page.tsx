"use client";

import { useState } from 'react';
import ChatForm from './_components/chat-form';
import ChatWindow from './_components/chat-window';
import Loader from './_components/loader';

export default function LegalAidChatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: message }];

    const response = await fetch('/api/legal-aid', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    setMessages([...newMessages, { role: "bot", content: data.response }]);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Legal Aid Chatbot</h1>
      <ChatWindow messages={messages} />
      {loading && <Loader />}
      <ChatForm onSendMessage={sendMessage} />
    </div>
  );
}
