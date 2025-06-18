export const strimMessageBody = (msgBody: String, maxLength: number) => {
  const charList = msgBody.split(" ");

  let res = "";

  for (let i = 0; i < charList.length; i++) {
    let temp;
    temp = charList.slice(0, i).join(" ");

    if (temp.length >= maxLength) {
      res = temp;
      break;
    }
  }

  res += "...";

  return res;
};
