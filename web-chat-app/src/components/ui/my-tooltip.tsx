import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const MyTooltip = ({
  className = "",
  content,
  hover,
  id,
}: {
  hover: ReactNode;
  content: string;
  className?: string;
  id: string;
}) => (
  <Tooltip key={id}>
    <TooltipTrigger className={`-z-5 ${className}`}>{hover}</TooltipTrigger>
    <TooltipContent>
      {content.split("\n").map((myContent, index) => (
        <p key={index}>{myContent}</p>
      ))}
    </TooltipContent>
  </Tooltip>
);
