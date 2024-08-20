import React from "react";
import { FaCheck } from "react-icons/fa6";

const Badge = ({ value, setActive, active }) => {
  return (
    <div
      className={`px-3 py-1 rounded-md flex items-center justify-center ${
        !active ? "bg-[#ddd] hover:bg-red-200" : "hover:bg-red-100 bg-red-300"
      } text-sm cursor-pointer mr-5`}
      onClick={() => setActive(!active)}
    >
      #{value}
      {active && <FaCheck className="ml-2" />}
    </div>
  );
};

export default Badge;
