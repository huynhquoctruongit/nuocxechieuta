import { connection } from "@/lib/directus";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";
import { getCookie } from "react-use-cookie";
import { create } from "zustand";
import _ from "lodash";

let statusConnected = "disconnected";
const useStatusConnection = create((set) => ({
  status: "disconnected",
  setStatus: (status) => set({ status }),
}));

const useConnection = () => {
  const { isLogin, profile } = useAuth();
  const { status, setStatus } = useStatusConnection();

  useEffect(() => {
    if (!isLogin) return;
    const token = getCookie("auth_token");
    if (status === "connected" || statusConnected !== "disconnected") return;
    connection.onWebSocket("close", function () {});
    const cleanup = connection.onWebSocket("message", function (data) {
      if (data.type == "auth" && data.status == "ok") {
        statusConnected = "connected";
        setStatus("connected");
      }
      if (data.type == "auth" && data.status == "error") {
        statusConnected = "disconnected";
        setStatus("disconnected");
      }
    });
    statusConnected = "connecting";
    connection
      .connect()
      .then((data) => {
        connection.sendMessage({ type: "auth", access_token: getCookie("auth_token") });
      })
      .catch((error) => {
        console.log("Error: ", error);
        statusConnected = "disconnected";
        setStatus("disconnected");
      });
    // window.addEventListener("beforeunload", (event) => {
    //   const url = "https://mindguros.vercel.app/api/activity-user/" + profile.id; // URL API của bạn
    //   navigator.sendBeacon(url);
    //   if (window.location.hostname.includes("localhost")) return;
    //   const confirmationMessage = "Bạn có chắc chắn muốn rời khỏi trang này? Các thay đổi của bạn có thể không được lưu.";
    //   event.preventDefault(); // Cần cho một số trình duyệt
    //   event.returnValue = confirmationMessage; // Hỗ trợ các trình duyệt mới
    //   return confirmationMessage;
    // });
    return () => {};
  }, [isLogin]);
  return { connection, status };
};

const cache = {
  keys: {},
};

const createSubscribe = async (event, collection, fields, filter, callback) => {
  const key = event + collection + JSON.stringify(filter);
  const { subscription, unsubscribe } = await connection.subscribe(collection, {
    event,
    query: {
      fields: fields || ["*"],
      filter,
    },
  });
  cache.keys[key] = { subscription, unsubscribe };
  for await (const message of subscription) {
    if (message.data) callback.current(message);
  }
  return unsubscribe;
};

export const useSubscribe = (event, collection, fields, filter, callback) => {
  const key = event + collection + JSON.stringify(filter);
  const { connection, status } = useConnection();

  useEffect(() => {
    const handler = cache.keys[key];

    if (!event || !collection || !filter || !callback) return;
    if (!connection || status !== "connected" || handler) return;

    createSubscribe(event, collection, fields, filter, callback);
    return () => {
      cache.keys[key]?.unsubscribe();
      cache.keys[key] = null;
    };
  }, [status]);
};

export default useConnection;
