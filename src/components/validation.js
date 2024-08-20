import { z } from "zod";

const ipRegex =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const cidrRegex =
  /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-2][0-9]|3[0-2])$/;

const ipSchema = z.string().regex(ipRegex, "Invalid IP address");
const cidrSchema = z.string().regex(cidrRegex, "Invalid CIDR address");
const portNumberRegex =
  /^(?:[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
const ipOrCidrSchema = z.union([ipSchema, cidrSchema]);

const isValidIPRange = (start, end) => {
  if (!start || !end) return true;
  const startParts = start.split(".").map(Number);
  const endParts = end.split(".").map(Number);
  return startParts.every((part, index) => part <= endParts[index]);
};

const schema = z
  .object({
    chain: z.string().optional(),
    sip: z
      .string()
      .optional()
      .refine((value) => ipRegex.test(value), "Invalid IP or CIDR format"),
    dip: z
      .string()
      .optional()
      .refine((value) => ipRegex.test(value), "Invalid IP or CIDR format"),
    rsip: z
      .string()
      .optional()
      .refine((value) => ipRegex.test(value), "Invalid IP"),
    rdip: z
      .string()
      .optional()
      .refine((value) => ipRegex.test(value), "Invalid IP"),
    rsip2: z
      .string()
      .optional()
      .refine((value) => ipRegex.test(value), "Invalid IP"),
    rdip2: z
      .string()
      .optional()
      .refine((value) => ipRegex.test(value), "Invalid IP"),
    protocol: z.string().max(8).optional(),
    sport: z
      .string()
      .optional()
      .refine((value) => portNumberRegex.test(value), "Invalid port number"),
    dport: z
      .string()
      .optional()
      .refine((value) => portNumberRegex.test(value), "Invalid port number"),
    rsport: z
      .string()
      .optional()
      .refine((value) => portNumberRegex.test(value), "Invalid port number"),
    rdport: z
      .string()
      .optional()
      .refine((value) => portNumberRegex.test(value), "Invalid port number"),
    rsport2: z
      .string()
      .optional()
      .refine((value) => portNumberRegex.test(value), "Invalid port number"),
    rdport2: z
      .string()
      .optional()
      .refine((value) => portNumberRegex.test(value), "Invalid port number"),
    target: z.string().optional(),
  })
  .refine((data) => data.sip && data.dip && data.sip !== data.dip, {
    message: "Source IP and Destination IP must be different",
    path: ["sip", "dip"],
  })
  .refine((data) => data.rsip && isValidIPRange(data.rsip, data.rsip2), {
    message: "Invalid range for source IPs",
    path: ["rsip", "rsip2"],
  })
  .refine((data) => data.rdip && isValidIPRange(data.rdip, data.rdip2), {
    message: "Invalid range for destination IPs",
    path: ["rdip", "rdip2"],
  })
  .refine((data) => data.rsport && data.rsport < data.rsport2, {
    message: "Source port range is invalid",
    path: ["rsport", "rsport2"],
  })
  .refine((data) => data.rdport && data.rdport < data.rdport2, {
    message: "Destination port range is invalid",
    path: ["rdport", "rdport2"],
  });
