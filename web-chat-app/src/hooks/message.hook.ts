import { useQuery } from "@apollo/client";
import { GET_LAST_MESSAGES, GET_MESSAGES } from "../services/messageService";

export const useGetMessages = (chatId?: string, first?: number) =>
  useQuery(GET_MESSAGES, { variables: { chatId, first }, skip: !chatId });

export const useGetLastMessages = (userId: string) =>
  useQuery(GET_LAST_MESSAGES, { variables: { userId } });
