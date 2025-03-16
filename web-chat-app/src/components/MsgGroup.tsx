import { ChatDetailsProps } from '../pages/chat/ChatDetails';
import { SingleMsg } from './SingleMsg';

const MsgGroup = ({ sender, receiver, msgList }: ChatDetailsProps) => {
  return (
    <div className="msg-group py-6">
      <div className="msg-time text-center text-gray-400 text-[0.75rem]">
        8:16
      </div>
      {msgList.map((msg) => {
        const isSentMsg = msg.user == sender.id;
        const avatar = isSentMsg ? sender.avatar : receiver.avatar;

        return (
          <SingleMsg
            key={msg.id}
            isSentMsg={isSentMsg}
            body={msg.body}
            avatar="/assets/images/test.jpg"
          ></SingleMsg>
        );
      })}
    </div>
  );
};

export { MsgGroup };
