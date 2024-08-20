import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin4Fill } from "react-icons/ri";
import AlertModel from "./AlertModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Tables = ({ rules, handleDelete, chain }) => {
  let data = rules[1].split(/\s+/).slice(3).join(" / ");
  // let chain = chain;
  // console.log(rules[1]);
  return (
    <>
      <ScrollArea className="h-[450px] w-full relative">
        <Table className="h-fit max-h-80 overflow-y-auto relative w-full">
          <TableHeader className=" w-full">
            <TableRow className=" bg-slate-200 hover:bg-slate-200 w-full">
              <TableHead className="w-[100px] text-red-400">Rule Num</TableHead>
              <TableHead className="text-red-400">Rule [ {data} ]</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          {rules && rules.length > 2 ? (
            <TableBody className="">
              {rules.map((line, index) => {
                const parts = line.split(/\s+/); // Split by whitespace
                const lineNumber = parseInt(parts[0], 10); // Extract line number}
                const ruleText = parts.slice(3).join(" "); // Extract rule details
                // const chain = ruleText.split(" ")[0];
                return (
                  !isNaN(lineNumber) && (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {isNaN(lineNumber) ? "0" : lineNumber}
                      </TableCell>
                      <TableCell className="">{ruleText}</TableCell>
                      <TableCell className="text-right flex justify-end gap-x-2">
                        {!ruleText.toLowerCase().includes("docker") && (
                          <>
                            <Button className="bg-blue-500  text-white">
                              <FiEdit2 className="" />
                            </Button>

                            <AlertModel
                              title="Are you deleting this rule?"
                              bg="red"
                              chain={chain}
                              rulenum={lineNumber}
                              content={`You are about to delete this rule from Chain ${chain}.
                                This action is irreversible.`}
                              action={handleDelete}
                            >
                              <Button
                                className="bg-red-500   text-white"
                                // onClick={() => handleDelete(chain, lineNumber)}
                              >
                                <RiDeleteBin4Fill className="" />
                              </Button>
                            </AlertModel>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                );
              })}
            </TableBody>
          ) : (
            <TableCaption className="flex justify-center items-center border-5 border-red-500">
              No rules
            </TableCaption>
          )}
        </Table>
      </ScrollArea>
    </>
  );
};

export default Tables;
