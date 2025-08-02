import { IMessage } from "@/interfaces/messages/message.interface";
import IModelConnection from "@/interfaces/modelConnection.interface";
import { GET_MESSAGES } from "@/services/messageService";
import { ApolloCache } from "@apollo/client";

export const updateMsgCache = ({
  option,
  newMsg,
  cache,
  first = 20,
}: {
  option: "REMOVE" | "ADD" | "CHANGE";
  newMsg: IMessage;
  cache: ApolloCache<any>;
  first?: number;
  after?: string;
}) => {
  const existing = cache.readQuery<{
    messages: IModelConnection<IMessage>;
  }>({
    query: GET_MESSAGES,
    variables: { chatId: newMsg.chat, first },
  });

  if (existing) {
    cache.writeQuery({
      query: GET_MESSAGES,
      variables: { chatId: newMsg.chat, first },
      data: {
        messages: {
          ...existing.messages,
          edges: [
            {
              __typename: "MessageEdge",
              cursor: newMsg.id,
              node: newMsg,
            },
            ...existing.messages.edges,
          ],
          pageInfo: {
            ...existing.messages.pageInfo,
            startCursor: newMsg.id,
          },
        } as IModelConnection<IMessage>,
      },
    });
  }
};
