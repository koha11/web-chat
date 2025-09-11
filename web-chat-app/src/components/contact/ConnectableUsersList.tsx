import IModelConnection from "@/interfaces/modelConnection.interface";
import { Button } from "../ui/button";
import { IUser } from "@/interfaces/user.interface";
import { useSendRequest, useHandleRequest } from "@/hooks/contact.hook";
import { useState, useEffect } from "react";
import Loading from "../ui/loading";

const ConnectableUsersList = ({
  connectableUsersConnection,
  userId,
  searchValue,
}: {
  connectableUsersConnection?: IModelConnection<IUser>;
  userId: string;
  searchValue: string;
}) => {
  const [sendRequest] = useSendRequest({});
  const [handleRequest] = useHandleRequest({ userId });

  const [requestMap, setRequestMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (connectableUsersConnection) {
      let myMap = {} as Record<string, boolean>;

      for (let edge of connectableUsersConnection.edges)
        myMap[edge.cursor] = false;

      setRequestMap(myMap);
    }
  }, [connectableUsersConnection]);

  if (!connectableUsersConnection) return <Loading></Loading>;

  return (
    <div>
      {searchValue.trim() == "" ? (
        <span className="font-bold">Suggested People</span>
      ) : connectableUsersConnection.edges.length == 0 ? (
        <span className="font-bold">No results found</span>
      ) : (
        <span className="font-bold">Results</span>
      )}

      <div className="py-2">
        {connectableUsersConnection.edges.map((edge) => {
          const user = edge.node;
          return (
            <div
              key={user.id}
              className="flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-300"
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`w-8 h-8 rounded-full bg-contain bg-no-repeat bg-center`}
                  style={{
                    backgroundImage: `url(${user.avatar})`,
                  }}
                ></div>
                <span className="font-bold">{user.fullname}</span>
              </div>
              {requestMap[user.id] ? (
                <Button
                  className="cursor-pointer h-8 w-16 bg-gray-400 text-white"
                  variant={"outline"}
                  onClick={() => {
                    handleRequest({
                      variables: { userId: user.id, isAccepted: false },
                    });
                    setRequestMap({ ...requestMap, [user.id]: false });
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  className="cursor-pointer h-8 w-16 bg-blue-400 text-white"
                  variant={"outline"}
                  onClick={() => {
                    sendRequest({ variables: { userId: user.id } });
                    setRequestMap({ ...requestMap, [user.id]: true });
                  }}
                >
                  Connect
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectableUsersList;
