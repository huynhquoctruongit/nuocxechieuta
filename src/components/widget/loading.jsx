import { enumFood } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const Loading = () => {
  const [active, setActive] = useState(0);
  const timmer = useRef(null);
  const itemActive = enumFood[active % enumFood.length];
  useEffect(() => {
    timmer.current = setInterval(() => {
      setActive((prev) => prev + 1);
    }, 500);
    return () => clearInterval(timmer.current);
  }, []);
  return (
    <div>
      <div className="w-40 h-40 bg-pastel-pink/40 rounded-[20px] p-2">
        <img src={itemActive} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        {Array.from({ length: 5 }).map((_, index) => {
          return (
            <div
              key={index + "dot"}
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
              className="w-3 h-3 rounded-full bg-pastel-pink animate-bounce"
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default Loading;
