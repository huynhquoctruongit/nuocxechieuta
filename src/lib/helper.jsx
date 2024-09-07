import { cms } from "./config";

export function getHostname() {
  const href = location.hostname;
  if (href.indexOf("nuocxechieuta") > -1) {
    return "nuocxechieuta.toidot.com";
  } else {
    return "localhost";
  }
}

export const createImage = (id, width, placeholder) => {
  if (!id) return placeholder || "";
  const domain = cms;
  return domain + "/assets/" + id + "?width=" + width;
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function scrollElementTo(element, targetPosition, duration = 1000) {
  const start = element.scrollTop; // Vị trí hiện tại của phần tử
  const startTime = "now" in window.performance ? performance.now() : new Date().getTime();
  const distance = targetPosition - start;

  function scroll() {
    const currentTime = "now" in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (currentTime - startTime) / duration);

    element.scrollTop = start + distance * easeInOutQuad(time);

    if (time < 1) {
      requestAnimationFrame(scroll);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  scroll();
}
export function fullName(item) {
  if (item?.fullname) {
    return item?.fullname;
  } else {
    return (item?.first_name || "") + " " + (item?.last_name || "");
  }
}