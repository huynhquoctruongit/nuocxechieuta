import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const createLinkOrder = (company, provider) => {
  return "/company/" + company + "/provider/" + provider;
};
export const url = "https://admin.qnsport.vn/websocket";
export const access_token = "DudCvrFf8z2MYcSVfmr4WdzJfK7uHtjZ";

export const enumFood = [
  "/images/food1.png",
  "/images/food2.png",
  "/images/food3.png",
  "/images/food4.png",
  "/images/food5.png",
  "/images/food6.png",
  "/images/food7.png",
  "/images/food8.png",
  "/images/food9.png",
  "/images/food10.png",
];
