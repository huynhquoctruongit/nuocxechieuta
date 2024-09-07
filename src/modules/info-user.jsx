import { useAuth } from "@/hooks/use-auth";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { LogOutIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import useStateModal from "@/hooks/use-modal";
 
const Profile = () => {
  const { profile, isLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  const [setOpenOnboarding] = useStateModal((state) => [state.setOpenOnboarding]);
  if (!isLogin) return null;
  return (
    <div className="flex items-center justify-between gap-4 relative">
      <div className="flex items-center justify-between">{profile?.fullname}</div>
      <div className="min-w-8 min-h-8 rounded-md shadow-md bg-pastel-pink cursor-pointer" onClick={() => setOpen(!open)}>
        <img src="/images/food3.png" alt="" className="w-8 h-8  " />
      </div>
      {open && (
        <div ref={ref} className="absolute top-full mt-2 gap-2 right-0 bg-white rounded-md  py-1 w-fit z-20 shadow">
          <div
            className=" flex px-2 py-1.5 hover:bg-pastel-pink/50 duration-200 gap-4 items-center cursor-pointer whitespace-nowrap"
            onClick={() => setOpenOnboarding(true)}
          >
            <Cog6ToothIcon className="w-4 h-4" /> Thay đổi
          </div>
          <div
            className="mt-1 px-2 py-1.5 hover:bg-pastel-pink/50 duration-200 gap-4 whitespace-nowrap flex items-center cursor-pointer"
            onClick={() => logout()}
          >
            <LogOutIcon className="w-4 h-4" />
            Đăng xuất
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
