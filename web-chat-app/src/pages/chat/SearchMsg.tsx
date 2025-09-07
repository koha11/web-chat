import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetMessages } from "@/hooks/message.hook";
import { IChatUsersInfo } from "@/interfaces/chat.interface";
import { IMessage } from "@/interfaces/messages/message.interface";
import { GET_MESSAGES } from "@/services/messageService";
import { useApolloClient } from "@apollo/client";
import { Search, X } from "lucide-react";
import { G } from "node_modules/graphql-ws/dist/common-DY-PBNYy";
import { useState } from "react";

const SearchMsg = ({
  setSearchingMsg,
  chatId,
  usersInfo,
}: {
  setSearchingMsg: (value: boolean) => void;
  chatId: string;
  usersInfo: { [userId: string]: IChatUsersInfo };
}) => {
  const client = useApolloClient();

  const [searchMsg, setSearchMsg] = useState("");

  const [searchResults, setSearchResults] = useState<IMessage[] | undefined>(
    undefined
  );

  return (
    <div className="space-y-2 overflow-y-scroll h-full px-1">
      <div className="flex items-center gap-2 p-2">
        <Button
          variant={"no_style"}
          className="rounded-full cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => setSearchingMsg(false)}
        >
          <X></X>
        </Button>
        <span className="font-bold text-xl">Search</span>
      </div>

      <div className="relative">
        <Search
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
          size={16}
        ></Search>
        <Input
          placeholder="Search in conversation"
          className="px-8 rounded-xl"
          value={searchMsg}
          onChange={(e) => setSearchMsg(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              // Trigger search action
              console.log("Searching for:", searchMsg);

              const { data } = await client.query({
                query: GET_MESSAGES,
                variables: { chatId, search: searchMsg, first: 20 },
              });

              setSearchResults(
                data.messages.edges.map((edge: any) => edge.node)
              );
            }
          }}
        ></Input>
        {searchMsg && (
          <Button
            variant={"no_style"}
            size={"no_style"}
            onClick={() => setSearchMsg("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:bg-gray-200 rounded-full p-1"
          >
            <X></X>
          </Button>
        )}
      </div>

      {searchMsg && !searchResults && (
        <div className="text-center text-gray-500 mt-6">
          Press "Enter" to search.
        </div>
      )}

      {searchResults &&
        searchResults.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-2 items-center hover:bg-gray-100  p-2 rounded-xl cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-full bg-contain bg-no-repeat bg-center`}
              style={{ backgroundImage: `url(${usersInfo[msg.user]?.avatar})` }}
            ></div>
            <div className="space-y-1">
              <div className="font-bold">{usersInfo[msg.user].nickname}</div>
              <div>{msg.msgBody}</div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchMsg;
