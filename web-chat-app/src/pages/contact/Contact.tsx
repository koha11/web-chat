import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useGetContacts, useRemoveConnect } from "../../hooks/contact.hook";
import Cookies from "js-cookie";
import Loading from "../../components/ui/loading";
import { ArrowLeftCircle, MoreHorizontal, Plus, Search, X } from "lucide-react";
import { usePostChat } from "../../hooks/chat.hook";
import { Button } from "../../components/ui/button";
import AddContactDialog from "../../components/contact/AddContactDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import ReceivedConnectRequestDialog from "../../components/contact/ReceivedConnectRequestDialog";
import SentConnectRequestDialog from "@/components/contact/SentConnectRequestDialog";
import ActiveList from "./ActiveList";
import ContactActionBar from "./ContactActionBar";
import { Input } from "@/components/ui/input";
import ContactGrid from "@/components/contact/ContactGrid";

const Contact = () => {
  const [searchValue, setSearchValue] = useState("");
  const [draft, setDraft] = useState(searchValue);

  const { data: contacts, loading: isContactsLoading } = useGetContacts({
    search: searchValue,
  });

  // keep draft in sync if the external value changes
  useEffect(() => setDraft(searchValue), [searchValue]);

  // push to parent state after user pauses typing
  useEffect(() => {
    const t = setTimeout(() => setSearchValue(draft), 300);
    return () => clearTimeout(t);
  }, [draft, setSearchValue]);

  return (
    <div className="flex justify-center text-black h-screen">
      <div className="container flex bg-white gap-4 py-4">
        <ActiveList></ActiveList>

        <section
          className="w-[75%] h-full p-4 bg-white rounded-2xl"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0 0 5px 2px" }}
        >
          <div className="h-[10%] flex items-center py-4 px-2 gap-4">
            <form action="" className="relative flex-auto">
              <Input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="rounded-3xl bg-gray-200 px-8 py-2 w-full text-gray-500"
                placeholder="Search Contacts"
              ></Input>
              <Search
                className="absolute left-3 top-[50%] translate-y-[-50%] text-gray-500"
                size={16}
              ></Search>
              {searchValue && (
                <Button
                  className="absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer hover:opacity-50"
                  size={"no_style"}
                  onClick={() => setSearchValue("")}
                >
                  <X size={16}></X>
                </Button>
              )}
            </form>
          </div>

          <ContactActionBar></ContactActionBar>

          <ContactGrid
            contacts={contacts?.edges.map((edge) => edge.node)}
          ></ContactGrid>
        </section>
      </div>
    </div>
  );
};

export default Contact;
