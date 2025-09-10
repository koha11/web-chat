import IContact from "@/interfaces/contact.interface";
import Cookies from "js-cookie";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useRemoveConnect } from "@/hooks/contact.hook";
import { Skeleton } from "../ui/skeleton";

const ContactGrid = ({ contacts }: { contacts?: IContact[] }) => {
  const userId = Cookies.get("userId") ?? "";

  const [removeContact] = useRemoveConnect({});

  if (!contacts)
    return (
      <div className="h-[80%] grid grid-cols-2 gap-4 auto-rows-min px-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            className={
              "flex shadow rounded-2xl justify-center items-center px-4 py-2"
            }
            key={n}
          >
            <Skeleton className="rounded-full h-22 w-22 bg-contain bg-no-repeat bg-center"></Skeleton>
            <div className="flex-auto px-4 space-y-2">
              <Skeleton className="w-full h-4"></Skeleton>
              <Skeleton className="w-[70%] h-4"></Skeleton>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="h-[80%] grid grid-cols-2 gap-4 auto-rows-min px-2">
      {contacts.map((contact) => {
        const contactUser = contact.users.find((user) => user.id != userId);

        if (!contactUser) throw new Error("Contact user not found");

        return (
          <div
            className={
              "flex shadow rounded-2xl justify-center items-center px-4 py-2"
            }
            key={contactUser.id}
          >
            <div
              className="rounded-2xl h-22 w-22 bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${contactUser?.avatar})` }}
            ></div>

            <div className="flex-auto px-4">
              <div className="font-bold">{contactUser.fullname}</div>
              <div className="">{contactUser.username}</div>
            </div>

            <Popover>
              <PopoverTrigger className="p-2 rounded-full hover:bg-gray-200 font-bold cursor-pointer">
                <MoreHorizontal></MoreHorizontal>
              </PopoverTrigger>
              <PopoverContent className="max-w-fit">
                <Button
                  className="w-full text-black bg-white cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    removeContact({ variables: { userId: contactUser.id } });
                  }}
                >
                  Remove contact
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      })}
    </div>
  );
};

export default ContactGrid;
