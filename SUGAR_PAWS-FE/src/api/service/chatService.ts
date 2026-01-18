import { useRequest } from "../Request";
import API from "../api";

export interface ChatMessage {
  id: number;
  message: string;
  response: string;
  createdAt: string;
}

export interface ChatHistoryResponse {
  data: ChatMessage[];
  total: number;
}

export interface ChatResponse {
  id: number;
  message: string;
  response: string;
  createdAt: string;
}

export const useChatService = () => {
  const { Request } = useRequest();

  const sendMessage = async (message: string) => {
    return Request.post<ChatResponse>(API.CHAT_MESSAGE, { message });
  };

  const getChatHistory = async (limit = 20, offset = 0) => {
    return Request.get<ChatHistoryResponse>(API.CHAT_HISTORY, {
      limit,
      offset,
    });
  };

  const clearChatHistory = async () => {
    return Request.del(API.CHAT_CLEAR);
  };

  return {
    sendMessage,
    getChatHistory,
    clearChatHistory,
  };
};
