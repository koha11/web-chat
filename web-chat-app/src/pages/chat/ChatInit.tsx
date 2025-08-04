import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { useGetContacts } from "@/hooks/contact.hook";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

const ChatInit = () => {
  const userId = Cookies.get("userId");

  const dropdownMenuTriggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setOpen] = useState(true);
  const { register } = useForm<{ search: string }>();

  const { data: contactConnection, loading: isContactsLoading } =
    useGetContacts({});

  return (
    <section
      className="flex-5 h-full p-4 bg-white rounded-2xl flex flex-col justify-center items-center"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="container flex items-center justify-between h-[10%] border-b-2 border-black gap-4">
        <div>To: </div>
        <Badge
          variant={"outline"}
          className="bg-blue-200 font-semibold text-blue-400"
        >
          <span>My Name</span>
          <Button
            variant={"no_style"}
            size={"no_style"}
            className="hover:bg-gray-200 hover:opacity-50 cursor-pointer p-1 rounded-full"
          >
            <X></X>
          </Button>
        </Badge>

        <div className="relative flex-1">
          <Input className="border-0" {...register("search")}></Input>
          <div className="absolute top-8 left-0 max-h-[20rem] overflow-y-auto w-[30%] shadow-2xl bg-white rounded-md py-2 px-2 space-y-2">
            <div className="font-semibold">Your contacts</div>
            {isContactsLoading ? (
              <Loading></Loading>
            ) : (
              contactConnection?.edges.map((edge) => {
                const contact = edge.node.users.filter(
                  (user) => user.id != userId
                )[0];

                return (
                  <div
                    className={`flex items-center gap-4 p-2 rounded-md hover:bg-gray-200 cursor-pointer`}
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center"
                      style={{
                        backgroundImage: `url(${contact.avatar})`,
                      }}
                    ></div>
                    <div className="">{contact.fullname}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-full"></div>
    </section>
  );
};

export default ChatInit;
