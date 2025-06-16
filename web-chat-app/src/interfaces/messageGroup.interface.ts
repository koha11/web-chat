import { IMessage } from "./message.interface";

interface IMessageGroup {
  timeString: string;
  messages: IMessage[];
}

export default IMessageGroup;
