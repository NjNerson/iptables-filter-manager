import React, { useState } from "react";

import { BsList } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { SiFirewalla } from "react-icons/si";
import RulesList from "./RulesList";
import TooltipModel from "./TooltipModel";

import { ScrollArea } from "@/components/ui/scroll-area";

const List = ({ rules, setRules, loading, error }) => {
  const [OpenList, setOpenList] = useState(false);
  return (
    <div
      className={`min-h-full w-3/4 border-l border-red-200 z-10 top-[66px] bg-[#fff]  fixed ${
        OpenList
          ? "right-0 shadow-[-8px_0px_1000px_0_rgba(0,0,0,0.4)]"
          : "right-[-75%]"
      }  border-r-red-600 transition-all duration-300`}
    >
      <TooltipModel title="Rules list">
        <div
          className="size-12 hover:bg-red-400 rounded-sm p-1 flex justify-center items-center bg-red-500 text-white shadow-lg 
        rounded-tl-sm rounded-bl-sm absolute top-5 -left-12 cursor-pointer"
          onClick={() => setOpenList(!OpenList)}
        >
          {OpenList ? (
            <MdClose className="size-10 font-light" />
          ) : (
            <BsList className="size-10 font-light" />
          )}
        </div>
      </TooltipModel>
      <h1 className="text-xl gap-x-3 tracking-wider p-2 pt-5 uppercase flex items-center justify-center">
        <SiFirewalla className="inline" />
        <span>Rules</span>
      </h1>
      <ScrollArea>
        <div className="min-h-full overflow-scroll">
          <RulesList
            loading={loading}
            error={error}
            rules={rules}
            setRules={setRules}
          ></RulesList>
        </div>
      </ScrollArea>
    </div>
  );
};

export default List;
