import { directus } from "@/lib/directus";
import { getHostname } from "@/lib/helper";
import { useEffect } from "react";
import { setCookie } from "react-use-cookie";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";
export function useAuth(options) {
  const {
    data: profile,
    error,
    mutate,
  } = useSWR("/users/me?fields=*,role.name,role.id", {
    revalidateOnFocus: false,
    // revalidateOnMount: false,
    shouldRetryOnError: false,
    ...options,
  });

  const [userInfo, setUserInfo] = useLocalStorage("userInfo", {});
  async function login() {
    await mutate();
  }

  async function logout() {
    await mutate(null, false);
    try {
      setCookie("refresh_token", "");
      setCookie("auth_token", "", {
        domain: getHostname(location.hostname),
        SameSite: "None",
        Secure: true,
      });
      setCookie("expires", "");
    } catch (error) { }
    directus.logout();
  }
  const firstLoading = profile === undefined && error === undefined;
  const profileObj = profile?.data || {};

  useEffect(() => {
    if (!userInfo.id || (userInfo.id && userInfo.id !== profileObj.id)) {
      setUserInfo({
        id: profileObj.id,
        email: profileObj.email,
        fullname: profileObj.fullname,
        role: profileObj.role,
        company: userInfo.company
      });
    }
  }, [profileObj.id]);

  return {
    isLogin: firstLoading ? null : profile ? true : false,
    profile: {
      ...profileObj,
      roleName: profileObj.role?.name || "",
      fullname: profileObj.fullname || profileObj.first_name + " " + profileObj.last_name,
    },
    error,
    login,
    logout,
    getProfile: mutate,
    firstLoading,
    mutate,
    data: profile?.data,
  };
}
