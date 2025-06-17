import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const MyTooltip = (
  hover: ReactNode,
  content: string,
  className: string = ""
) => (
  <Tooltip>
    <TooltipTrigger className={className}>{hover}</TooltipTrigger>
    <TooltipContent>
      {content.split("\n").map((myContent) => (
        <p>{myContent}</p>
      ))}
    </TooltipContent>
  </Tooltip>
);
