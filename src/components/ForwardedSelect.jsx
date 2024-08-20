import React, { forwardRef } from "react";
import { Select, SelectTrigger, SelectContent, SelectValue } from "./ui/select";
import { useForm, Controller } from "react-hook-form";

const ForwardedSelect = React.forwardRef(
  ({ placeholder, children, name, control }, ref) => {
    return (
      // <Select>
      //   <SelectTrigger className="w-[180px] fields-shadow">
      //     <SelectValue placeholder={placeholder || "CHAIN"} />
      //   </SelectTrigger>
      //   <SelectContent>{children}</SelectContent>
      // </Select>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            className="w-[180px] fields-shadow"
          >
            <SelectTrigger className="w-[180px] fields-shadow">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
        )}
      />
    );
  }
);

ForwardedSelect.displayName = "ForwardedSelect";

export default ForwardedSelect;
