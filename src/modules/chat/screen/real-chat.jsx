"use client"
import useMessage from "../helper/use-message";
import { cn } from "@/lib/utils";
import { createImage } from "@/lib/helper";
import { motion } from "framer-motion";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

const variant = {
  initial: { opacity: 1, y: 200 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 200 },
};
const Invester = () => {
  const [show, setShow] = useState(true);
  const open = (href) => {
    window.open(href + `?utm_source=web-dat-com&utm_url=${window.location.href}`, "_blank");
  };

  return (
    <motion.div className="py-4 md:py-3 bg-white md:bg-pastel-pink">
      <div className="root-wrapper flex items-center gap-4 md:gap-10 text-left">
        <div className="text-xs md:hidden text-[#164474]">Học IELTS cùng với: </div>
        <div onClick={() => open("https://ielts1984.vn")} className="flex items-center lg:items-end gap-4 cursor-pointer">
          <img src="/images/ielts.webp" className="h-8 md:h-10 w-auto" alt="" />{" "}
          <span className="text-white text-md mb-1 font-bold hidden md:block">Học bản chất, học 1 lần dùng cả đời</span>
        </div>
        <div onClick={() => open("https://youpass.vn")} className="flex items-center lg:items-end gap-4 cursor-pointer">
          <img src="/images/youpass.png" className="h-6 md:h-8 w-auto" alt="" />{" "}
          <span className="text-white text-md font-bold hidden md:block">Luyện tập IELTS miễn phí tại nhà</span>
        </div>
      </div>
    </motion.div>
  );
};

const MarqueeChat = () => {
  const { messages = [] } = useMessage();

  if (messages.length === 0) return <Invester />;
  return null;
};

export default MarqueeChat;
