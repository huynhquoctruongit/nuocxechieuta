"use client"
import { Button } from "@/components/common/button-hero";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/common/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AxiosClient from "@/lib/api/axios-client";
import { createImage } from "@/lib/helper";
import { cn, enumFood } from "@/lib/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useStateModal from "@/hooks/use-modal";

const ModalLogin = () => {
  const { data } = useSWR("/items/collection_image?filter[name][_eq]=avatar&fields=*,images.*");
  const listAvatar = data?.data[0]?.images || [];
  const { profile, isLogin, mutate } = useAuth();
  const { openLogin, setOpenLogin, openOnboarding, setOpenOnboarding } = useStateModal();
  const [active, setActive] = useState(0);
  const [text, setText] = useState("");
  const { destructive, success } = useToast();

  const loginByGoogle = () => {
    location.replace("https://cms.toidot.com/auth/login/google?redirect=" + location.origin + "?callback=" + location.pathname);
  };
  const loginByFacebook = () => {
    alert("Đang đợi facebook duyệt nha má :3");
  };
  const isOnboarding = !profile?.avatar && isLogin;
  useEffect(() => {
    if (isLogin === false) setOpenLogin(true);
    if (isOnboarding) setOpenOnboarding(true);
    if (isLogin === true) {
      setText(profile?.fullname);
    }
  }, [isLogin]);
  const onUpdateProfile = async () => {
    if (text.trim() === "") {
      destructive("Họ và tên không được để trống");
      return;
    }
    const names = text.trim().split(" ");
    const first_name = names[0];
    const last_name = names.slice(1, 100).join(" ");
    console.log(active, listAvatar);

    const data = { first_name, last_name, avatar: listAvatar[active]?.directus_files_id };
    await AxiosClient.patch("/users/me", data);
    mutate();
    success("Cập nhật thông tin thành công");
    setOpenOnboarding(false);
  };

  return (
    <>
      <Dialog open={openLogin} className="">
        <DialogContent className="sm:max-w-[425px] bg-white text-black bg-[url(/background-auth.png)] bg-cover">
          <DialogHeader>
            <DialogTitle className="text-black">Đăng nhập đi mấy ní</DialogTitle>
          </DialogHeader>
          <div className="py-4 w-fit mx-auto mt-4">
            <div
              onClick={loginByGoogle}
              className="rounded-full cursor-pointer hover:border-solid hover:-translate-y-0.5 hover:shadow-sm duration-200 border gap-3 border-dashed border-light-03 p-1 pr-3 flex items-center justify-center bg-white w-fit"
            >
              <img src="/images/google.png" className="w-6 h-6 rounded-full" alt="" />
              Đăng nhập bằng Google
            </div>
            <div
              onClick={loginByFacebook}
              className="rounded-full  cursor-pointer hover:border-solid hover:-translate-y-0.5 hover:shadow-sm duration-200  mt-6 border gap-3 border-dashed border-light-03 p-1 pr-3 flex items-center justify-center bg-white w-fit"
            >
              <img src="/images/facebook.png" className="w-6 h-6 rounded-full" alt="" />
              Đăng nhập bằng Facebook
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center mt-10">
            {listAvatar.slice(0, 6).map((item, index) => {
              return (
                <div
                  key={item.directus_files_id}
                  className="rounded-full w-12 h-12 bg-pastel-pink/50 flex items-center justify-center"
                >
                  <img src={createImage(item.directus_files_id, 200)} className="w-10 h-10" alt="" />
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openOnboarding} className="">
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[425px] bg-white text-black bg-[url(/background-auth.png)] bg-cover"
        >
          <DialogHeader>
            <DialogTitle className="text-black">Điền thông tin đi mấy ní</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="text-sm mb-2">Họ và tên</div>
            <div className="rounded-md border border-gray-300 bg-white py-2 px-4 w-full focus:border-pastel-pink">
              <input
                value={text}
                autoFocus={false}
                onChange={(e) => setText(e.target.value)}
                type="text"
                className=" focus:outline-none text-sm w-full "
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            {enumFood.slice(0, 4).map((item, index) => {
              return (
                <div
                  key={"login" + index}
                  onClick={() => setActive(index)}
                  className="rounded-md w-20 h-20 bg-pastel-pink/50 flex items-center cursor-pointer justify-center relative"
                >
                  <div
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 duration-200  ease-in-out -translate-y-1/2 rounded-xl w-24 h-24 border border-dashed border-gray-400",
                      active === index ? "opacity-100 scale-95" : "opacity-0 scale-90",
                    )}
                  ></div>
                  <img src={item} className="w-16 h-16" alt="" />
                </div>
              );
            })}
          </div>
          <div className=" mb-10 text-center mt-6">
            <Button onClick={onUpdateProfile} size="sm">
              Cập nhật thông tin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalLogin;
