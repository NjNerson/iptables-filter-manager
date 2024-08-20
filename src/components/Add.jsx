import React, { useEffect, useState } from "react";
import ForwardedSelect from "./ForwardedSelect";
import { SelectItem } from "./ui/select";
import { IoAddSharp } from "react-icons/io5";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Badge from "./Badge";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addRule, fetchRules, getUsers } from "../api/iptables";
import { IoMdSettings } from "react-icons/io";
import { useToast } from "./ui/use-toast";

import axios from "axios";

const Add = ({ updateRules }) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState();

  const [POLICY, setPOLICY] = useState(false);
  const [SIP, setSIP] = useState(false);
  const [DIP, setDIP] = useState(false);
  const [RSIP, setRSIP] = useState(false);
  const [RDIP, setRDIP] = useState(false);
  const [PRO, setPRO] = useState(false);
  const [DPORT, setDPORT] = useState(false);
  const [SPORT, setSPORT] = useState(false);
  const [RDPORT, setRDPORT] = useState(false);
  const [RSPORT, setRSPORT] = useState(false);
  const [USER, setUSER] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    if (POLICY) data["policy"] = "-P";
    console.log(data);
    try {
      await addRule(data);
      const getRules = async () => {
        try {
          const data = await fetchRules();
          updateRules(data);
        } catch (error) {
          setError("Failed to fetch rules.");
        } finally {
          setLoading(false);
        }
      };
      reset();
      getRules();
      toast({
        title: "ADD RULE",
        description: "Rule added successfully!",
        className: " border-green-400 border text-green-400 bg-black/60",
      });
    } catch (error) {
      console.error("Error adding rule:", error);
      toast({
        title: "ADD RULE",
        description: "Error when adding rule!",
        className: " border-red-400 border text-red-400 bg-black/60",
      });
    }
  };
  useEffect(() => {
    const retrieveUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        console.log("getusers", data);
      } catch (error) {
        setError("Failed to fetch rules.");
      } finally {
        setLoading(false);
      }
    };

    retrieveUsers();
    console.log("users", users);
  }, []);

  useEffect(() => {
    if (RDPORT || RSPORT || SPORT || DPORT) {
      setPRO(true);
    }
  }, [RDPORT, RSPORT, SPORT, DPORT]);

  useEffect(() => {
    if (RSIP) {
      setSIP(false);
    }
  }, [RSIP]);

  useEffect(() => {
    if (RDIP) {
      setDIP(false);
    }
  }, [RDIP]);

  useEffect(() => {
    if (SIP) {
      setRSIP(false);
    }
  }, [SIP]);
  useEffect(() => {
    if (DIP) {
      setRDIP(false);
    }
  }, [DIP]);

  useEffect(() => {
    if (RSPORT) {
      setSPORT(false);
    }
  }, [RSPORT]);
  useEffect(() => {
    if (RDPORT) {
      setDPORT(false);
    }
  }, [RDPORT]);

  useEffect(() => {
    if (SPORT) {
      setRSPORT(false);
    }
  }, [SPORT]);
  useEffect(() => {
    if (DPORT) {
      setRDPORT(false);
    }
  }, [DPORT]);

  return (
    <>
      <div className="params w-full py-4 ">
        <h1 className="text-red-400 flex items-center gap-x-1">
          {" "}
          <IoMdSettings /> Parameters :
        </h1>
        <div className="flex flex-wrap gap-y-2 p-2">
          <Badge value="source ip" setActive={setSIP} active={SIP} />
          <Badge value="destination ip" setActive={setDIP} active={DIP} />
          <Badge value="source port" setActive={setSPORT} active={SPORT} />
          <Badge value="destination port" setActive={setDPORT} active={DPORT} />
          <Badge
            value="range source port"
            setActive={setRSPORT}
            active={RSPORT}
          />
          <Badge
            value="range destination port"
            setActive={setRDPORT}
            active={RDPORT}
          />
          <Badge value="protocol" setActive={setPRO} active={PRO} />
          <Badge value="range source ip" setActive={setRSIP} active={RSIP} />
          <Badge
            value="range destination ip"
            setActive={setRDIP}
            active={RDIP}
          />
          <Badge value="user" setActive={setUSER} active={USER} />
          <Badge value="policy" setActive={setPOLICY} active={POLICY} />
        </div>
      </div>
      <hr className="border-slate-200" />
      <form onSubmit={handleSubmit(onSubmit)} className="Form pt-5">
        {/* CHAIN */}
        <div className="fields-m-5">
          <Label className="text-slate-800" htmlFor="chain">
            Chain
          </Label>
          <ForwardedSelect name="chain" control={control} placeholder="CHAIN">
            <SelectItem value="INPUT">INPUT</SelectItem>
            <SelectItem value="OUTPUT">OUTPUT</SelectItem>
            <SelectItem value="FORWARD">FORWARD</SelectItem>
          </ForwardedSelect>

          {errors.chain && (
            <p className="text-red-500">{errors.chain.message}</p>
          )}
        </div>
        {/* SIP */}

        <div className="pt-2 flex flex-wrap pl-5">
          {SIP && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="sip">
                Source IP
              </Label>
              <Input
                id="sip"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="192.168.53.103 or 192.168.0.0/24"
                {...register("sip", { required: "Value required" })}
              />
              {errors.sip && (
                <p className="text-red-500">{errors.sip.message}</p>
              )}
            </div>
          )}

          {RSIP && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="rsip">
                Range Source IP
              </Label>
              <Input
                id="rsip"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="192.168.53.103"
                {...register("rsip", { required: "Value required" })}
              />
              <Input
                id="rsip2"
                type="text"
                className=" w-80 mt-2 fields-shadow"
                placeholder="192.168.53.224"
                {...register("rsip2", { required: "Value required" })}
              />
              {errors.rsip && (
                <p className="text-red-500">{errors.rsip.message}</p>
              )}
              {errors.rsip2 && (
                <p className="text-red-500">{errors.rsip2.message}</p>
              )}
            </div>
          )}

          {DIP && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="dip">
                Destination IP
              </Label>
              <Input
                id="dip"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="192.168.53.103 or 192.168.0.0/24"
                {...register("dip", { required: "Value required" })}
              />
              {errors.dip && (
                <p className="text-red-500">{errors.dip.message}</p>
              )}
            </div>
          )}

          {RDIP && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="rdip">
                Range Destination IP
              </Label>
              <Input
                id="rdip"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="192.168.53.103"
                {...register("rdip", { required: "Value required" })}
              />
              <Input
                id="rdip2"
                type="text"
                className=" w-80 mt-2 fields-shadow"
                placeholder="192.168.53.224"
                {...register("rdip2", { required: "Value required" })}
              />
              {errors.rdip && (
                <p className="text-red-500">{errors.rdip.message}</p>
              )}
              {errors.rdip2 && (
                <p className="text-red-500">{errors.rdip2.message}</p>
              )}
            </div>
          )}

          {PRO && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="protocol">
                Protocol
              </Label>
              <Input
                id="protocol"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="ex: tcp"
                {...register("protocol", { required: "Value required" })}
              />
              {errors.protocol && (
                <p className="text-red-500">{errors.protocol.message}</p>
              )}
            </div>
          )}
          {SPORT && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="sport">
                Source Port
              </Label>
              <Input
                id="sport"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="23"
                {...register("sport", { required: "Value required" })}
              />
              {errors.sport && (
                <p className="text-red-500">{errors.sport.message}</p>
              )}
            </div>
          )}
          {RSPORT && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="rsport">
                Range Source Port
              </Label>
              <Input
                id="rsport"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="1000"
                {...register("rsport", { required: "Value required" })}
              />
              <Input
                id="rsport2"
                type="text"
                className=" w-80 mt-2 fields-shadow"
                placeholder="2000"
                {...register("rsport2", { required: "Value required" })}
              />
              {errors.rsport && (
                <p className="text-red-500">{errors.rsport.message}</p>
              )}
              {errors.rsport2 && (
                <p className="text-red-500">{errors.rsport2.message}</p>
              )}
            </div>
          )}
          {DPORT && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="dport">
                Destination Port
              </Label>
              <Input
                id="dport"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="53"
                {...register("dport", { required: "Value required" })}
              />
              {errors.dport && (
                <p className="text-red-500">{errors.dport.message}</p>
              )}
            </div>
          )}

          {RDPORT && (
            <div className="fields-m-5">
              <Label className="text-slate-800" htmlFor="rdport">
                Range Destination Port
              </Label>
              <Input
                id="rdport"
                type="text"
                className=" w-80 fields-shadow"
                placeholder="1000"
                {...register("rdport", { required: "Value required" })}
              />
              <Input
                id="rdport2"
                type="text"
                className=" w-80 mt-2 fields-shadow"
                placeholder="2000"
                {...register("rdport2", { required: "Value required" })}
              />
              {errors.rdport && (
                <p className="text-red-500">{errors.rdport.message}</p>
              )}
              {errors.rdport2 && (
                <p className="text-red-500">{errors.rdport2.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="fields-m-5 mt-5">
          <Label className="text-slate-800" htmlFor="target">
            Target
          </Label>
          <ForwardedSelect name="target" control={control} placeholder="TARGET">
            <SelectItem value="ACCEPT">ACCEPT</SelectItem>
            <SelectItem value="DROP">DROP</SelectItem>
            <SelectItem value="REJECT">REJECT</SelectItem>
          </ForwardedSelect>

          {errors.target && (
            <p className="text-red-500">{errors.target.message}</p>
          )}
        </div>
        <div className="py-5">
          <Button type="submit">
            <IoAddSharp className="size-5" /> Add rule
          </Button>
        </div>
      </form>
    </>
  );
};

export default Add;
