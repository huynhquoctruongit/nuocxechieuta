import { connection } from "@/lib/directus";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useState } from "react";

const cache = {};

const subscribe = _.debounce((event, filter, cb) => subscribeCore(event, filter, cb), 100);

export const subscribeCore = async (event, filter, cb) => {
  const key = JSON.stringify(filter) + event;
  cache[key] = {
    status: "init",
    unsubscribe: null,
  };
  console.log(filter);
  
  const { subscription, unsubscribe } = await connection.subscribe("order", {
    event: event,
    query: {
      fields: ["*"],
      filter: filter,
    },
  });
  for await (const message of subscription) {
    console.log("have event");

    if (message.event === event) cb(message);
  }

  cache[key] = {
    status: "init",
    unsubscribe: unsubscribe,
  };
  return { subscription, unsubscribe };
};

const useSubscribe = (event, filter, cb = () => {}) => {
  const key = JSON.stringify(filter) + event;
  useEffect(() => {
    let unsubscribe = () => {};
    if (cache[key]) unsubscribe = cache[key].unsubscribe;
    else subscribe(event, filter, cb);
    console.log("in");

    return () => {
      console.log("out");

      unsubscribe();
      cache[key] = null;
    };
  }, []);

  return null;
};

export default useSubscribe;
