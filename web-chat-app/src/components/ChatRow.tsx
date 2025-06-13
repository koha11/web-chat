import { NavLink } from 'react-router-dom';

const ChatRow = ({ id, chatName, user, lastMessage }: ChatRowProps) => {
  return (
    <NavLink
      to={`/m/${id}`}
      className={({ isActive }) =>
        isActive
          ? 'chat-box flex w-full items-center h-18 p-4 rounded-2xl bg-gray-400 cursor-default'
          : 'chat-box flex w-full items-center h-18 hover:bg-gray-200 p-4 rounded-2xl'
      }
    >
      <div
        className="w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${user.avatar})` }}
      ></div>
      <div className="flex-auto px-4 flex flex-col items-baseline">
        <div className="font-bold">{user.fullname}</div>
        <div className="text-gray-500 text-[0.75rem]">
          {lastMessage.content} ·2 giờ
        </div>{' '}
      </div>
      <div
        className="w-6 h-6 rounded-full bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${user.avatar})` }}
      ></div>
    </NavLink>
  );
};

export type ChatRowProps = {
  id: string;
  chatName: string;
  user: {
    avatar: string;
    fullname: string;
  };
  lastMessage: {
    content: string;
  };
};

export { ChatRow };
