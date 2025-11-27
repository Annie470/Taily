import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const useChat = (postId, token) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    // storico
    fetch(`${API_URL}/posts/${postId}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(console.error);

    // connessione ws
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat/${postId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [postId, token]);

  const sendMessage = (content) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: `/app/chat/${postId}`,
        body: JSON.stringify({ content }),
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  };

  return { messages, sendMessage, connected };
};
