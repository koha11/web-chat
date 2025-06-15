const SingleMsg = ({
  body,
  isLongGap,
  isSentMsg,
  avatar,
}: {
  isSentMsg: boolean;
  body: string;
  avatar: string;
  isLongGap: boolean;
}) => {
  // Nếu là tin nhắn gửi đi
  if (isSentMsg == true)
    return (
      <div
        className={
          isLongGap
            ? 'single-msg sent-msg justify-end flex items-center gap-2 mt-4'
            : 'single-msg sent-msg justify-end flex items-center gap-2 mt-[0.125rem]'
        }
      >
        <span className="py-1 px-3 text-xl text-[1rem] bg-gray-200 rounded-2xl">
          {body}
        </span>
        {/* <div
          className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${avatar})` }}
        ></div> */}
      </div>
    );
  // Nếu là tin nhắn nhận đến
  else
    return (
      <div
        className={
          isLongGap
            ? 'single-msg receiver-msg justify-baseline flex items-center gap-2 mt-4'
            : 'single-msg receiver-msg justify-baseline flex items-center gap-2 mt-[0.125rem]'
        }
      >
        <div
          className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
        <span className="py-1 px-3 text-xl text-[1rem] bg-gray-200 rounded-2xl">
          {body}
        </span>
      </div>
    );
};

export default SingleMsg;
