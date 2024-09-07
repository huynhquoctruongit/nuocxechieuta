"use client"
import AxiosClient from "@/lib/api/axios-client";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ChevronDown, SendIcon } from "lucide-react";
import { act, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "next/navigation";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import useMessage from "../helper/use-message";
import useConnection, { useSubscribe } from "@/hooks/use-connection";
import { call } from "lodash/groupBy";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { createImage } from "@/lib/helper";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";

const Widgets = () => {
  const [show, setShow] = useState(false);
  const { companyId, ...rest } = useParams();
  const location = window.location.pathname;
  console.log(companyId, rest, location);
  return (
    <>
      <div className="fixed cursor-pointer bottom-4 flex flex-col gap-2 md:bottom-10 right-4 md:right-10 z-[1000]">
        <Link to="/relax" className=" rounded-full p-2 bg-white shadow-md relative group ">
          <img src="/images/health.png" className="w-8 h-8 object-contain" />
          <div className="absolute hidden group-hover:flex bottom-full border border-dashed border-primary-01/50 right-full w-96 h-96 bg-white rounded-full items-center justify-center">
            <img src="/images/health.png" className="w-80 h-80 object-contain " />
          </div>
          <div className="w-2 h-2 rounded-full absolute top-0 right-0 animate-ping bg-primary-01"></div>
        </Link>
        {companyId && (
          <div className=" rounded-full p-2 bg-white shadow-md relative" onClick={() => setShow(true)}>
            <img src="/images/chat.png" className="w-8 h-8 object-contain" />
          </div>
        )}
        {!companyId && <div className="rounded-full p-2 w-12 h-12 relative"></div>}
      </div>
      <ChatWidget show={show} setShow={setShow} />
    </>
  );
};

const ChatWidget = ({ show, setShow }) => {
  const ref = useRef(null);
  const wrap = useRef(null);
  const refLoading = useRef(null);
  const { companyId } = useParams();
  const { profile } = useAuth();
  const { messages, setMessages, isLoading } = useMessage();
  const init = useRef();
  const { connection, status } = useConnection();
  const [activity, setActivity] = useState([]);
  const prevent = useRef(false);

  const refActivity = useRef(null);
  refActivity.current = activity.find((elm) => elm.user_created.id === profile.id);

  const sendMessage = async () => {
    if (refLoading.current) return;
    refLoading.current = true;
    const message = ref.current.innerHTML;
    ref.current.innerHTML = "";
    deleteType(refActivity.current?.id);
    await AxiosClient.post("/items/message", {
      message: message,
      company: companyId,
    });
    refLoading.current = false;
  };
  const callback = useRef(null);
  callback.current = (message) => {
    if (message.event !== "create") return;
    setMessages(message.data[0]);
  };

  useSubscribe("create", "message", ["*,user_created.*"], { company: { _eq: companyId } }, callback);
  const typing = useRef(null);
  typing.current = (message) => {
    if (message.event !== "create" && message.event !== "delete") return;

    if (message.event === "create") setActivity([...activity, message.data[0]]);
    if (message.event === "delete") setActivity(activity.filter((elm) => elm.id !== message.data[0]));
  };

  useSubscribe("create", "activity_user", ["*,user_created.*"], { company: companyId, name: "typing" }, typing);
  useSubscribe("delete", "activity_user", ["*,user_created.*"], { company: companyId, name: "typing" }, typing);

  useEffect(() => {
    ref.current.addEventListener("keydown", (e) => {
      if (e.ctrlKey === false && e.shiftKey === false && e.metaKey === false && e.key === "Enter") {
        e.preventDefault();
        if (!ref.current.innerHTML.trim()) return;
        sendMessage();
      }
    });
  }, []);
  useLayoutEffect(() => {
    if ((messages && messages.length === 0) || init.current || !show) return;
    init.current = true;
    wrap.current.scrollTo({
      top: wrap.current.firstChild.clientHeight,
    });
  }, [messages, show]);

  useEffect(() => {
    wrap.current.scrollTo({
      top: wrap.current.firstChild.clientHeight,
      behavior: "smooth",
    });
  }, [messages, activity]);

  const createType = () => {
    if (prevent.current) return;
    prevent.current = true;
    connection.sendMessage({
      type: "items",
      collection: "activity_user",
      action: "create",
      data: { name: "typing", company: companyId },
    });
  };
  const deleteType = () => {
    console.log(refActivity);
    if (!refActivity.current?.id) return;

    prevent.current = false;
    connection.sendMessage({
      type: "items",
      collection: "activity_user",
      action: "delete",
      id: refActivity.current?.id,
    });
  };

  const onChange = (e) => {
    const value = e.target.innerText.trim();
    if (value) {
      createType();
    } else {
      deleteType();
    }
  };

  return (
    <>
      <div className={cn("fixed bottom-0 z-[10] right-0 md:right-10 w-full md:w-96 h-[30rem] ", { hidden: !show })}>
        <div className="absolute top-0 left-0 w-full h-full scale-[103%] border border-pastel-pink/30 bg-white z-[-3] rounded-2xl rounded-b-none"></div>
        <div className="bg-slate-50/20 border border-b-0 border-pastel-pink rounded-b-none rounded-xl flex flex-col relative z-10 w-full h-full">
          <div className="flex items-center justify-between w-full border-pastel-pink border-b p-4 ">
            <h1 className="text-sm font-semibold">Tâm sự cơm trưa</h1>
            <div className="p-l cursor-pointer" onClick={() => setShow(false)}>
              <ChevronDown className="stroke-gray-500" />
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 h-full w-full overflow-y-auto p-4" ref={wrap}>
              <div className="flex flex-col mb-4 min-h-[100%]">
                {messages.length === 0 && (
                  <div className="text-xs border border-dashed border-pastel-pink p-2 rounded-2xl flex items-center gap-4">
                    <img src="/images/upload.gif" className="min-w-12 w-12 aspect-square" alt="" />
                    Xin chào mấy ní, hãy để lại lời nhắn cho tớ nha
                  </div>
                )}
                {messages.map((elm, index) => {
                  const isMe = elm.user_created?.id === profile.id;
                  const fullname = elm.user_created?.first_name + " " + elm.user_created?.last_name;
                  return (
                    <div className={cn("flex mb-4 justify-start pb-4", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn("flex gap-2 items-start justify-start max-w-[90%]")} key={elm.id}>
                        <div className="flex items-center justify-end gap-2">
                          <div className="relative group">
                            <img
                              src={createImage(elm.user_created.avatar, 300)}
                              className="min-w-10 w-10 h-10 bg-white p-1 border border-dashed border-gray-500 aspect-square rounded-full"
                            />
                          </div>
                        </div>
                        <div
                          className={cn(
                            "relative w-fit border-gray-300 p-2 rounded-2xl rounded-tl-md",
                            isMe ? "bg-primary-01 text-white" : "bg-secondary-01 text-white",
                          )}
                        >
                          <div className="text-xs mb-2 text-gray-200">{fullname}</div>
                          <div
                            dangerouslySetInnerHTML={{ __html: elm.message }}
                            className={cn("text-sm  ", isMe ? "bg-primary-01 text-white" : "bg-secondary-01 text-white")}
                          ></div>
                          <div className={cn("text-[10px] mt-1 text-slate-400 text-right absolute top-full left-0")}>
                            {dayjs(elm.date_created).format("HH:mm:ss")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <AnimatePresence>
                  {activity.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className=""
                    >
                      <div className="text-xs text-right p-2">
                        {activity.map((item) => item.user_created.first_name).join(", ")} Typing...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-pastel-pink text-sm flex items-end">
            <div ref={ref} contentEditable onInput={onChange} className="focus:outline-none flex-1 pr-2"></div>
            <div className="cursor-pointer" onClick={sendMessage}>
              <PaperAirplaneIcon className="w-5 h-5 -rotate-45 stroke-pastel-pink" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Widgets;
