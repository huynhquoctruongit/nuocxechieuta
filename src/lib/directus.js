import { authentication, createDirectus, rest, realtime } from "@directus/sdk";
import { cms } from "./config";
import { getCookie } from "react-use-cookie";

export const directus = createDirectus(cms)
  .with(authentication("cookie", { credentials: "include", autoRefresh: true }))
  .with(rest());

export const connection = createDirectus(cms).with(realtime());
