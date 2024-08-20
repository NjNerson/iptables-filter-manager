import { GiFirewall } from "react-icons/gi";
import List from "./components/List";
import Add from "./components/Add.jsx";
import { fetchRules } from "./api/iptables";
import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";

const App = () => {
  const [rules, setRules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRules = async () => {
      try {
        const data = await fetchRules();
        setRules(data);
      } catch (error) {
        setError("Failed to fetch rules.");
      } finally {
        setLoading(false);
      }
    };
    getRules();
  }, []);

  return (
    <>
      <div className="relative bg-[rgba(251,251,251,1)]">
        <h1 className="bg-white shadow-md flex justify-between items-center text-red-500 p-3 px-8 text-2xl tracking-wider sticky top-0 z-[100]">
          <GiFirewall className="size-10" />
          <span className="">
            IPTABLES&nbsp;&nbsp;FILTER&nbsp;&nbsp;MANAGER
          </span>
        </h1>

        <div className="container h-full border-green-800 py-5 bg-[rgba(251,251,251,1)]">
          <div className="w-4/5 m-auto">
            <Add updateRules={setRules} />
          </div>
          <List
            loading={loading}
            error={error}
            rules={rules}
            setRules={setRules}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default App;
