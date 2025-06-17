import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const MyTooltip = (hover: ReactNode, content: string) => (
  <Tooltip>
    <TooltipTrigger>{hover}</TooltipTrigger>
    <TooltipContent>
      {content.split("\n").map((myContent) => (
        <p>{myContent}</p>
      ))}
    </TooltipContent>
  </Tooltip>
);
