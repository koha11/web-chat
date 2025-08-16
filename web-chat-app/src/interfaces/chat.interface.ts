import { IMessage } from "./messages/message.interface";
import { IUser } from "./user.interface";

export interface IChat {
  id: string;
  users: IUser[] | string[];
  messages: IMessage[] | string[];
  usersInfo: {
    [id: string]: {
      nickname: string;
      avatar: string;
      fullname: string;
      addBy?: string;
      role?: "CREATOR" | "MEMBER" | "LEADER";
      joinAt?: Date;
      leaveMsgId?: string;
      lastMsgSeen?: string; //msgId
    };
  };
  chatType: "GROUP" | "PRIVATE";
  chatName: string;
  chatAvatar: string;
  lastMsgSeen?: { [userId: string]: [msgId: string] }; //[userId]: msgId -> dung de duyet seen tin nhan nhanh hon

  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
