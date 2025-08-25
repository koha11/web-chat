import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_MEMBERS,
  CHANGE_CHAT_AVATAR,
  CHANGE_CHAT_NAME,
  CHANGE_NICKNAME,
  GET_CHAT,
  GET_CHATS,
  HANDLE_CALL,
  HANGUP_CALL,
  LEAVE_CHAT,
  MAKE_CALL,
  POST_CHAT,
  REMOVE_FROM_CHAT,
} from "../services/chatService";
import { IChat } from "../interfaces/chat.interface";
import IModelConnection, {
  Edge,
} from "../interfaces/modelConnection.interface";
import IMyQueryResult from "../interfaces/myQueryResult.interface";
import { IUser } from "../interfaces/user.interface";
import { useState, useRef, useEffect } from "react";
import { pusher } from "@/pusher";

export const useGetChats = ({
  userId,
  after,
  first = 10,
}: {
  userId: string;
  after?: string;
  first?: number;
}): IMyQueryResult<IModelConnection<IChat>> => {
  const myQuery = useQuery(GET_CHATS, { variables: { userId, after, first } });

  if (myQuery.error) throw myQuery.error;

  let data: IModelConnection<IChat> | undefined;

  if (myQuery.data) {
    const queryData = myQuery.data.chats;
    data = {
      edges: queryData.edges.map((edge: Edge<IChat>) => {
        const chat = edge.node;
        const users = chat.users as IUser[];
        const isGroupChat = chat.users.length > 2;

        const defaultChatAvatar =
          users.find((user) => user.id != userId)?.avatar ?? "";

        const defaultChatName =
          chat.usersInfo[users.find((user) => user.id != userId)!.id].nickname;

        const defaultGroupChatName = users.reduce<String>((acc, user) => {
          if (user.id == userId) return acc;

          return acc == ""
            ? acc + chat.usersInfo[user.id].nickname.split(" ")[0]
            : acc + ", " + chat.usersInfo[user.id].nickname.split(" ")[0];
        }, "");

        return {
          ...edge,
          node: {
            ...chat,
            chatAvatar:
              chat.chatAvatar == "" ? defaultChatAvatar : chat.chatAvatar,
            chatName:
              chat.chatName == ""
                ? isGroupChat
                  ? defaultGroupChatName
                  : defaultChatName
                : chat.chatName,
          },
        };
      }),
      pageInfo: queryData.pageInfo,
    };
  }

  return {
    data: data,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const useGetChat = ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}): IMyQueryResult<IChat> => {
  const myQuery = useQuery(GET_CHAT, { variables: { chatId } });

  if (myQuery.error) throw myQuery.error;

  let data: IChat | undefined;

  if (myQuery.data) {
    const chat = myQuery.data.chat;
    const users = chat.users as IUser[];
    const isGroupChat = chat.users.length > 2;

    const defaultChatAvatar =
      users.find((user) => user.id != userId)?.avatar ?? "";

    const defaultChatName =
      chat.usersInfo[users.find((user) => user.id != userId)!.id].nickname;

    const defaultGroupChatName = users.reduce<String>((acc, user) => {
      if (user.id == userId) return acc;

      return acc == ""
        ? acc + chat.usersInfo[user.id].nickname.split(" ")[0]
        : acc + ", " + chat.usersInfo[user.id].nickname.split(" ")[0];
    }, "");

    data = {
      ...chat,
      chatAvatar: chat.chatAvatar == "" ? defaultChatAvatar : chat.chatAvatar,
      chatName:
        chat.chatName == ""
          ? isGroupChat
            ? defaultGroupChatName
            : defaultChatName
          : chat.chatName,
    };
  }

  return {
    data: data,
    loading: myQuery.loading,
    subscribeToMore: myQuery.subscribeToMore,
    refetch: myQuery.refetch,
    fetchMore: myQuery.fetchMore,
  };
};

export const usePostChat = ({
  userId,
  after,
  first = 10,
}: {
  userId: string;
  after?: string;
  first?: number;
}) => {
  return useMutation(POST_CHAT, {
    refetchQueries: [{ query: GET_CHATS, variables: { userId, first, after } }],
    awaitRefetchQueries: true,
  });
};

export const useAddMembers = ({
  userId,
  after,
  first = 10,
}: {
  userId: string;
  after?: string;
  first?: number;
}) => {
  return useMutation(ADD_MEMBERS, {
    update: (cache, { data }) => {
      const changedChat = data.addMembers as IChat;

      const existing = cache.readQuery<{
        chats: IModelConnection<IChat>;
      }>({
        query: GET_CHATS,
        variables: { userId, first, after },
      });

      if (existing)
        cache.writeQuery({
          query: GET_CHATS,
          variables: { userId, first, after },
          data: {
            chats: {
              ...existing.chats,
              edges: existing.chats.edges.map((edge) => {
                if (edge.cursor == changedChat.id)
                  return {
                    __typename: "ChatEdge",
                    cursor: changedChat.id,
                    node: changedChat,
                  };

                return edge;
              }),
            } as IModelConnection<IChat>,
          },
        });
    },
  });
};

export const useRemoveMember = ({
  userId,
  after,
  first = 10,
}: {
  userId: string;
  after?: string;
  first?: number;
}) => {
  return useMutation(REMOVE_FROM_CHAT);
};

export const useLeaveChat = () => {
  return useMutation(LEAVE_CHAT);
};

export const useChangeNickname = () => {
  return useMutation(CHANGE_NICKNAME);
};

export const useChangeChatAvatar = () => {
  return useMutation(CHANGE_CHAT_AVATAR);
};

export const useChangeChatName = () => {
  return useMutation(CHANGE_CHAT_NAME);
};

export const useMakeCall = () => {
  return useMutation(MAKE_CALL);
};

export const useHandleCall = () => {
  return useMutation(HANDLE_CALL);
};

export const useHangupCall = () => {
  return useMutation(HANGUP_CALL);
};

export const useCall = ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        // Add your TURN here for reliability:
        // { urls: 'turn:YOUR_TURN_HOST:3478', username: 'u', credential: 'p' }
      ],
    });
    pcRef.current = pc;

    const channelName = `call.${roomId}`;
    const ch = pusher.subscribe(channelName);

    console.log(ch);

    // Receive remote track
    const remote = new MediaStream();
    setRemoteStream(remote);

    pc.ontrack = ({ streams }) => {
      console.log(streams);
      streams[0] && streams[0].getTracks().forEach((t) => remote.addTrack(t));
    };

    // Send ICE to peers
    pc.onicecandidate = ({ candidate }) => {
      console.log("onicecandidate", candidate);
      if (candidate)
        ch.trigger("client-ice", {
          candidate: candidate.toJSON(),
          from: userId,
        });
    };

    // Handle signaling
    ch.bind(
      "client-offer",
      async ({
        sdp,
        from,
      }: {
        sdp: RTCSessionDescriptionInit;
        from: string;
      }) => {
        console.log("client-offer", { sdp, from });
        if (from === userId) return;
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        ch.trigger("client-answer", {
          sdp: pc.localDescription,
          from: userId,
        });
      }
    );

    ch.bind(
      "client-answer",
      async ({
        sdp,
        from,
      }: {
        sdp: RTCSessionDescriptionInit;
        from: string;
      }) => {
        console.log("client-answer", { sdp, from });
        if (from === userId) return;
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    );

    ch.bind(
      "client-ice",
      async ({
        candidate,
        from,
      }: {
        candidate: RTCIceCandidateInit;
        from: string;
      }) => {
        console.log("client-ice", { candidate, from });
        if (from === userId) return;
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch {}
      }
    );

    // Start local media and send an offer when another member is present
    let stopped = false;

    ch.bind("pusher:subscription_error", (error: any) => {
      console.error("Subscription error", error);
    }); // fires on auth/subscribe failure

    // When a second member joins, make an offer
    ch.bind("pusher:subscription_succeeded", (_: any) => {
      console.log("Subscription succeeded");
      // no-op
    });

    (async () => {
      const local = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      local.getTracks().forEach((t) => pc.addTrack(t, local));
      setLocalStream(local);

      ch.bind("pusher:member_added", async () => {
        console.log("Member added");
        if (stopped) return;
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        await pc.setLocalDescription(offer);

        ch.trigger("client-offer", {
          sdp: pc.localDescription,
          from: userId,
        });
      });
    })();

    return () => {
      stopped = true;
      pusher.unsubscribe(channelName);
      pc.close();
    };
  }, [roomId]);

  return { remoteStream, localStream };
};
