import React, { useEffect, useState } from "react";
import { fetchRules, deleteRule } from "../api/iptables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "./ui/use-toast";
import Tables from "./Tables";

const RulesTable = ({ loading, error, rules, setRules }) => {
  const { toast } = useToast();
  const handleDelete = async (chain, lineNumber) => {
    try {
      await deleteRule(chain, lineNumber);
      // Refresh the rules list after deletion
      toast({
        title: "DELETE RULE",
        description: "Rule deleted successfully!",
        className: " border-green-400 border text-green-400 bg-black/60",
      });
      const data = await fetchRules();
      setRules(data);
    } catch (error) {
      toast({
        title: "DELETE RULE",
        description: `Error: ${error}!`,
        className: " border-red-400 border text-red-400 bg-black/60",
      });
      // setError("Failed to delete rule.");
    }
  };

  if (loading)
    return (
      <p className="text-red-400 bg-slate-100 shadow-xl flex justify-center items-center text-2xl uppercase">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="bg-red-400 text-white flex justify-center items-center  text-2xl uppercase">
        {error}
      </p>
    );

  return (
    <div>
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="input">INPUT</TabsTrigger>
          <TabsTrigger value="output">OUTPUT</TabsTrigger>
          <TabsTrigger value="forward">FORWARD</TabsTrigger>
        </TabsList>
        <TabsContent value="input">
          <Tables
            rules={rules["INPUT"]}
            chain="INPUT"
            handleDelete={handleDelete}
          ></Tables>
        </TabsContent>
        <TabsContent value="output">
          <Tables
            rules={rules["OUTPUT"]}
            chain="OUTPUT"
            handleDelete={handleDelete}
          ></Tables>
        </TabsContent>
        <TabsContent value="forward">
          <Tables
            rules={rules["FORWARD"]}
            chain="FORWARD"
            handleDelete={handleDelete}
          ></Tables>
        </TabsContent>
      </Tabs>
    </div>
    // <button onClick={() => handleDelete(chain, lineNumber)}>
    //                     Delete
    //                   </button>
  );
};

export default RulesTable;
