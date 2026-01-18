"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  HiChatBubbleLeftRight,
  HiMiniSparkles,
  HiMiniUserCircle,
} from "react-icons/hi2";
import { IoSend, IoClose, IoInformationCircle } from "react-icons/io5";
import { BsRobot, BsHeartFill, BsStars } from "react-icons/bs";
import { RiShoppingBag3Fill, RiTruckFill } from "react-icons/ri";
import { FaPaw, FaRegClock, FaShieldAlt } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import styles from "./ChatBot.module.css";
import { useChatService, ChatMessage } from "@/api/service/chatService";
import { getAuthToken } from "@/helper/storage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  responseFormat?: 'markdown' | 'text';
}

interface ChatResponse extends ChatMessage {
  responseFormat?: 'markdown' | 'text';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useChatService();
  const router = useRouter();

  // Handle link clicks in chat messages
  const handleLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    
    if (href.startsWith('/collections/')) {
      // Navigate to product page
      router.push(href);
    } else if (href.startsWith('/')) {
      // Navigate to internal page
      router.push(href);
    } else if (href.startsWith('http')) {
      // External link
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  }, [router]);
  // Component to render message content based on format
  const MessageContent = ({ message }: { message: Message }) => {
    if (!message.isUser && message.responseFormat === 'markdown') {
      return (
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a 
                href={href} 
                className={`${styles.chatLink} ${styles.chatLinkInBot}`}
                onClick={(e) => handleLinkClick(e, href || '#')}
              >
                {children}
              </a>
            ),
            p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>,
            ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-custom-dark">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
          }}
        >
          {message.text}
        </ReactMarkdown>
      );
    }
    
    return <div className="whitespace-pre-line">{message.text}</div>;
  };

  const quickActions = [
    { text: "Product Info", icon: <RiShoppingBag3Fill className="w-4 h-4" /> },
    { text: "Shipping", icon: <RiTruckFill className="w-4 h-4" /> },
    { text: "Returns", icon: <FaShieldAlt className="w-4 h-4" /> },
    { text: "Size Guide", icon: <IoInformationCircle className="w-4 h-4" /> },
  ];

  const defaultWelcomeMessage: Message = useMemo(
    () => ({
      id: "welcome",
      text: "Hello! I'm Sugar Bot 🐾, Sugar Paws' virtual assistant. I can help you learn about products, orders, and answer other questions. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }),
    []
  );
  // Convert ChatMessage from API to local Message format
  const convertChatHistoryToMessages = useCallback(
    (chatHistory: ChatMessage[]): Message[] => {
      const messages: Message[] = [];

      chatHistory.forEach((chat) => {
        // Add user message
        messages.push({
          id: `user-${chat.id}`,
          text: chat.message,
          isUser: true,
          timestamp: new Date(chat.createdAt),
        });        // Add bot response with responseFormat
        messages.push({
          id: `bot-${chat.id}`,
          text: chat.response,
          isUser: false,
          timestamp: new Date(chat.createdAt),
          responseFormat: (chat as unknown as ChatResponse).responseFormat || 'text',
        });
      });

      return messages.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
    },
    []
  );

  // Load chat history when component mounts or when chat opens
  const loadChatHistory = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      // If not authenticated, show default welcome message
      setMessages([defaultWelcomeMessage]);
      setShowQuickActions(true);
      return;
    }

    try {
      const response = await chatService.getChatHistory(50, 0);
      if (response.data && response.data.data.length > 0) {
        const historyMessages = convertChatHistoryToMessages(
          response.data.data
        );
        setMessages(historyMessages);
        setShowQuickActions(false);
      } else {
        // No chat history, show welcome message and quick actions
        setMessages([defaultWelcomeMessage]);
        setShowQuickActions(true);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Fallback to welcome message
      setMessages([defaultWelcomeMessage]);
      setShowQuickActions(true);
    }
  }, [chatService, defaultWelcomeMessage, convertChatHistoryToMessages]);

  // Load chat history when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen, messages.length, loadChatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const token = getAuthToken();
    if (!token) {
      alert("Please login to use the chat feature");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText;
    setInputText("");
    setIsTyping(true);
    setShowQuickActions(false);    try {
      const response = await chatService.sendMessage(messageText);
      if (response.data) {        const botMessage: Message = {
          id: `bot-${response.data.id}`,
          text: response.data.response,
          isUser: false,
          timestamp: new Date(response.data.createdAt),
          responseFormat: (response.data as unknown as ChatResponse).responseFormat || 'text',
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Fallback to a generic error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later or contact our support team.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    setInputText(actionText);
    setShowQuickActions(false);
    // Trigger send message with the quick action text
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.chatButton} fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group ${
          isOpen
            ? "bg-custom-wine text-white"
            : "bg-gradient-to-r from-custom-rose to-custom-pink text-white hover:shadow-xl"
        }`}
        aria-label="Open chat"
      >
        <div className="relative">
          <div className={`${styles.iconContainer} relative`}>
            <IoClose
              className={`w-7 h-7 absolute inset-0 transition-all duration-300 ${
                isOpen
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-75 rotate-180"
              }`}
            />
            <HiChatBubbleLeftRight
              className={`w-7 h-7 absolute inset-0 transition-all duration-300 ${styles.wiggleOnHover} ${
                isOpen
                  ? "opacity-0 scale-75 rotate-180"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />
          </div>
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-custom-yellow rounded-full animate-pulse"></div>
          )}
        </div>
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-custom-dark text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat with Sugar Bot 🐾
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white rounded-2xl shadow-2xl border border-custom-pink/20 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-custom-rose to-custom-pink text-white px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BsRobot className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Sugar Bot
                  <HiMiniSparkles className="w-5 h-5 text-custom-yellow animate-pulse" />
                </h3>
                <p className="text-sm opacity-90 flex items-center gap-1">
                  <FaPaw className="w-3 h-3" />
                  Sugar Paws Assistant • Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 p-4 h-80 overflow-y-auto ${styles.chatScrollbar} bg-gradient-to-b from-custom-yellow/20 to-custom-pink/10`}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.isUser ? "justify-end" : "justify-start"
                } ${message.isUser ? styles.messageUser : styles.messageBot}`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {!message.isUser && (
                    <div className="w-8 h-8 bg-gradient-to-r from-custom-rose to-custom-pink rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                      <BsRobot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.isUser
                        ? "bg-custom-rose text-white rounded-br-md shadow-md"
                        : "bg-white text-custom-dark border border-custom-pink/20 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <MessageContent message={message} />
                    <div
                      className={`text-xs mt-2 flex items-center gap-1 ${
                        message.isUser ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      <FaRegClock className="w-3 h-3" />
                      {message.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {message.isUser && (
                    <div className="w-8 h-8 bg-custom-wine rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                      <HiMiniUserCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {showQuickActions &&
              messages.length === 1 &&
              messages[0].id === "welcome" && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <BsStars className="w-4 h-4 text-custom-rose" />
                    Quick actions to get started:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        className={`${styles.quickAction} flex items-center gap-2 p-3 bg-white border border-custom-pink/30 rounded-xl hover:bg-custom-yellow/20 hover:border-custom-rose/50 transition-all duration-200 text-sm font-medium text-custom-dark`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-custom-rose">{action.icon}</span>
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-custom-rose to-custom-pink rounded-full flex items-center justify-center flex-shrink-0">
                    <BsRobot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-custom-pink/20 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 bg-custom-rose rounded-full ${styles.typingDot}`}
                      ></div>
                      <div
                        className={`w-2 h-2 bg-custom-rose rounded-full ${styles.typingDot}`}
                      ></div>
                      <div
                        className={`w-2 h-2 bg-custom-rose rounded-full ${styles.typingDot}`}
                      ></div>
                      <span className="ml-2 text-xs text-gray-500">
                        Sugar Bot is typing...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-custom-pink/20 bg-white">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... 💬"
                  className="w-full px-4 py-3 pr-12 border border-custom-pink/30 rounded-full focus:outline-none focus:ring-2 focus:ring-custom-rose/50 focus:border-custom-rose text-sm resize-none"
                  disabled={isTyping}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-custom-pink/50">
                  <FaPaw className="w-4 h-4" />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={inputText.trim() === "" || isTyping}
                className={`p-3 rounded-full transition-all duration-200 ${
                  inputText.trim() === "" || isTyping
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-custom-rose to-custom-pink text-white hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
              >
                <IoSend className="w-5 h-5" />
              </button>
            </div>

            {/* Love message */}
            <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
              <BsHeartFill className="w-3 h-3 text-custom-rose mr-1" />
              Made with love for lolita lovers
              <BsHeartFill className="w-3 h-3 text-custom-rose ml-1" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
