import { Input } from "@/components/ui/input";

const ChatInit = () => {
  return (
    <section
      className="flex-5 h-full p-4 bg-white rounded-2xl flex flex-col justify-center items-center"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="container flex items-center justify-between h-[10%] border-b-2 border-black gap-4">
        <div>To: </div>
        <Input className="border-0"></Input>
      </div>
      <div className="flex justify-center items-center h-full"></div>
    </section>
  );
};

export default ChatInit;
