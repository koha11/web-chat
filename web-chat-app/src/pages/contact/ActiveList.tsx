import { usePostChat } from "@/hooks/chat.hook";
import { useGetContacts } from "@/hooks/contact.hook";
import { ArrowLeftCircle, Link } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client";

const ActiveList = () => {
  const userId = Cookies.get("userId")!;
  const navigate = useNavigate();
  const client = useApolloClient();

  const { data: contacts, loading: isContactsLoading } = useGetContacts({});

  const [postChat] = usePostChat({ userId });

  return (
    <section
      className="w-[25%] h-full p-2 bg-white rounded-2xl"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
    >
      <div className="flex justify-baseline items-center h-[10%] px-2 gap-4">
        <div className="text-xl">
          <NavLink to={"/m"}>
            <ArrowLeftCircle></ArrowLeftCircle>
          </NavLink>
        </div>
        <h1 className="text-2xl font-bold">Active</h1>
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
              onClick={async (e) => {
                if (!edge.node.chatId) {
                  e.preventDefault();
                  const createdChat = await postChat({
                    variables: {
                      users: edge.node.users.map((user) => user.id),
                    },
                  });
                  client.refetchQueries({ include: ["GetChats"] });
                  navigate("/m/" + createdChat.data.postChat.id);
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
  );
};

export default ActiveList;
