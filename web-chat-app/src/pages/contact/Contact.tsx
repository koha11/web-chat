import { useEffect, useState } from "react";
import {
  Link,
  NavigationType,
  NavLink,
  Outlet,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useGetContacts } from "../../hooks/contact.hook";
import Cookies from "js-cookie";
import Loading from "../../components/ui/loading";
import {
  ArrowLeftCircle,
  MoreHorizontal,
  MoveLeftIcon,
  Plus,
} from "lucide-react";
import { usePostChat } from "../../hooks/chat.hook";
import { Button } from "../../components/ui/button";
import AddContactDialog from "../../components/contact/AddContactDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import ReceivedConnectRequestDialog from "../../components/contact/ReceivedConnectRequestDialog";
import SentConnectRequestDialog from "../../components/contact/SentConnectRequestDialog";

const Contact = () => {
  const userId = Cookies.get("userId") ?? "";
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isReceivedRequestDialogOpen, setReceivedRequestDialogOpen] =
    useState(false);
  const [isSentRequestDialogOpen, setSentRequestDialogOpen] = useState(false);

  const { data: contacts, loading: isContactsLoading } = useGetContacts({
    userId,
  });

  const [postChat, { data: createdChat }] = usePostChat();

  useEffect(() => {
    if (createdChat) navigate("/m/" + createdChat.postChat.cursor);
  }, [createdChat]);

  if (isContactsLoading) return <Loading></Loading>;

  return (
    <div className="flex justify-center text-black h-screen">
      <div className="container flex bg-white gap-4 py-4">
        <section
          className="w-[25%] h-full p-2 bg-white rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
        >
          <div className="flex justify-between items-center h-[10%] px-2">
            <div className="text-xl">
              <Link to={"/m"}>
                <ArrowLeftCircle></ArrowLeftCircle>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Danh sách hoạt động</h1>
          </div>

          <nav
            id="chat-box-list"
            className="h-[90%] overflow-y-scroll flex flex-col gap-2 mt-4"
          >
            {contacts?.edges.map((edge) => {
              const contact = edge.node.users.find((user) => user.id != userId);
              return (
                <NavLink
                  to={"/m/" + edge.node.chatId}
                  onClick={(e) => {
                    if (!edge.node.chatId) {
                      postChat({
                        variables: {
                          users: edge.node.users.map((user) => user.id),
                        },
                      });
                      e.preventDefault();
                    }
                  }}
                  className="flex items-center justify-between rounded-xl py-2 px-4 hover:bg-gray-300"
                  key={contact?.id}
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                      style={{ backgroundImage: `url(${contact?.avatar})` }}
                    ></div>
                    <span>{contact?.fullname}</span>
                  </div>
                  {contact?.isOnline ? (
                    <div
                      className={`w-3 h-3 rounded-full bg-contain bg-no-repeat bg-center bg-green-600`}
                    ></div>
                  ) : (
                    <div
                      className={`w-3 h-3 rounded-full bg-contain bg-no-repeat bg-center bg-gray-400`}
                    ></div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </section>

        <section
          className="w-[75%] h-full p-4 bg-white rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
        >
          <div className="h-[10%] flex items-center py-4 px-2 gap-4">
            <form action="" className="relative flex-auto">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
                placeholder="Tìm kiếm liên hệ"
              ></input>
              <i className="bx bx-search absolute left-3 top-[50%] translate-y-[-50%] text-gray-500"></i>
            </form>
          </div>
          <div className="h-[10%] flex items-center justify-between py-4 px-2">
            <div className="flex items-center justify-baseline gap-4">
              <Button
                variant={"outline"}
                className="cursor-pointer rounded-xl relative"
                onClick={() => setReceivedRequestDialogOpen(true)}
              >
                <span>Received Connect Request</span>
                <div className="absolute h-5 w-5 bg-red-700 rounded-full flex justify-center items-center font-bold text-[0.6rem] text-white -right-2 -top-2">
                  12
                </div>
              </Button>
              <Button
                variant={"outline"}
                className="cursor-pointer rounded-xl relative"
                onClick={() => setSentRequestDialogOpen(true)}
              >
                <span>Sent Connect Request</span>
                <div className="absolute h-5 w-5 bg-red-700 rounded-full flex justify-center items-center font-bold text-[0.6rem] text-white -right-2 -top-2">
                  12
                </div>
              </Button>
            </div>
            <Button
              variant={"outline"}
              className="cursor-pointer"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus></Plus>
              <b>Add contact</b>
            </Button>
          </div>
          <div className="h-[80%] grid grid-cols-2 gap-4 auto-rows-min px-2">
            {contacts?.edges.map((edge) => {
              const contact = edge.node.users.find((user) => user.id != userId);

              return (
                <div
                  className={
                    "flex shadow rounded-2xl justify-center items-center px-4 py-2"
                  }
                  key={contact?.id}
                >
                  <div
                    className="rounded-2xl h-22 w-22 bg-contain bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${contact?.avatar})` }}
                  ></div>

                  <div className="flex-auto px-4">
                    <div className="font-bold">{contact?.fullname}</div>
                    <div className="">{contact?.username}</div>
                  </div>

                  <Popover>
                    <PopoverTrigger className="p-2 rounded-full hover:bg-gray-200 font-bold cursor-pointer">
                      <MoreHorizontal></MoreHorizontal>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-fit">
                      <Button className="w-full text-black bg-white cursor-pointer hover:bg-gray-200">
                        Remove connect
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <AddContactDialog
        isOpen={isAddDialogOpen}
        setOpen={setAddDialogOpen}
      ></AddContactDialog>
      <ReceivedConnectRequestDialog
        isOpen={isReceivedRequestDialogOpen}
        setOpen={setReceivedRequestDialogOpen}
      ></ReceivedConnectRequestDialog>
      {/* <SentConnectRequestDialog
        isOpen={isSentRequestDialogOpen}
        setOpen={setSentRequestDialogOpen}
      ></SentConnectRequestDialog> */}
    </div>
  );
};

export default Contact;
