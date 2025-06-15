export const displaySendMsgTime = (sendTime: Date) => {
  let timeString = "";

  // Hiệu giữa thời gian hiện tại với thời gian của tin nhắn
  const diffTime = new Date().getTime() - sendTime.getTime();

  // Nếu tin nhắn được nhắn trong ngày
  if (sendTime.getDay() == new Date().getDay())
    timeString = sendTime.toLocaleTimeString("vi-VN").slice(0, 5);
  // Nếu tin nhắn được nhắn trong vòng 7 ngày đổ lại
  else if (diffTime / (1000 * 60 * 60 * 24) <= 7) {
    timeString = sendTime.toLocaleTimeString("vi-VN", {
      weekday: "short",
    });

    timeString = timeString.slice(0, 5).concat(timeString.slice(8, 13));

    // Mặc định (tin nhắn xa hơn 7 ngày)
  } else {
    timeString = sendTime.toLocaleTimeString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    timeString = timeString.slice(0, 5).concat(timeString.slice(8));
  }

  return timeString;
};
