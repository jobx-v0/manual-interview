import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSocket } from "../../../context/SocketContext";
import { RootState } from "@/lib/store";
import { addChat } from "@/lib/features/roomChat/roomChatSlice";

interface RoomChatProps {
  role: string;
  roomId: string;
}

interface ChatMessage {
  sender: string; // The user sending the message
  message: string; // The message content
  timestamp: string; // The timestamp of the message
}

const RoomChat: React.FC<RoomChatProps> = ({ role, roomId }) => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const chatHistory = useSelector(
    (state: RootState) => state.roomChat.chatHistory
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (socket && message.trim()) {
      setLoading(true);

      socket.emit(
        "sendMessage",
        { roomId, message: message.trim() },
        (response: { success: boolean; data: ChatMessage }) => {
          setLoading(false);
          if (response.success) {
            dispatch(addChat(response.data));
            setMessage("");
          }
        }
      );
    }
  };

  // Scroll to bottom whenever chatHistory changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div
      className="flex flex-col"
      style={{
        height: role === "admin" ? "calc(100vh - 159px)" : "calc(100vh - 64px)",
      }}
    >
      <ScrollArea className="flex-1 overflow-auto">
        <div className="space-y-4 p-4">
          {chatHistory.map((chat, index) => {
            const isUserMessage =
              (role === "admin" && chat.sender === "admin") ||
              (role === "candidate" && chat.sender === "candidate");

            return (
              <div
                key={index}
                className={`flex gap-3 ${isUserMessage ? "justify-end" : ""}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isUserMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold">
                      {chat.sender === role
                        ? "You"
                        : chat.sender === "admin"
                        ? "Admin"
                        : "Candidate"}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{chat.message}</p>
                </div>
              </div>
            );
          })}
          {/* Dummy element to target for auto-scroll */}
          <div ref={bottomRef}></div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2 bg-gray-50 rounded-full p-1">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                handleSendMessage();
              }
            }}
            disabled={loading}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-transparent"
          />

          <Button
            size="icon"
            className="rounded-full"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;
