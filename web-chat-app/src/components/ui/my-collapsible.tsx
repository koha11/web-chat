import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import React, { ReactNode, useState } from "react";
import { Button } from "./button";

const MyCollapsible = ({
  title,
  data,
}: {
  title: string;
  data: { content: ReactNode; onClick: Function }[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Collapsible className="w-full" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="hover:bg-gray-200 flex items-center justify-between w-full rounded-md cursor-pointer px-2 py-3 font-bold">
        <span>{title}</span>
        {open ? <ChevronUp></ChevronUp> : <ChevronDown></ChevronDown>}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {data.map((row) => {
          return (
            <Button
              className="hover:bg-gray-200 flex items-center justify-baseline gap-4 w-full rounded-md cursor-pointer px-2 py-1 font-bold bg-white text-black outline-0 shadow-none"
              onClick={() => row.onClick()}
            >
              {row.content}
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MyCollapsible;
