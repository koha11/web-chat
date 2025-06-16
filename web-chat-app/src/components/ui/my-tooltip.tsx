import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const MyTooltip = (hover: ReactNode, content: string) => (
  <Tooltip>
    <TooltipTrigger>{hover}</TooltipTrigger>
    <TooltipContent>
      <p>{content}</p>
    </TooltipContent>
  </Tooltip>
);
