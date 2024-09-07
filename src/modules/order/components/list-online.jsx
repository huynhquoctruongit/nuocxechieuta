import { useUserInCompany } from "@/hooks/use-company";
import useConnection, { useSubscribe } from "@/hooks/use-connection";
import AxiosClient from "@/lib/api/axios-client";
import { enumFood } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { useAuth } from "@/hooks/use-auth";
import { createImage } from "@/lib/helper";
import { useMediaQuery } from "usehooks-ts";

const ListOnline = () => {
  const others = useOthers();

  const { profile } = useAuth();
  const [persence, updateMyPresence] = useMyPresence();
  const userCount = others.length;
  const isMd = useMediaQuery("(min-width: 768px)");
  const limit = isMd ? 5 : 3;

  useEffect(() => {
    const user = {
      name: profile.first_name + " " + profile.last_name,
      avatar: profile.avatar,
      id: profile.id,
    };
    updateMyPresence({ profile: user });
  }, []);
  if (userCount === 0) return null;
  return (
    <div className="w-fit flex flex-wrap gap-4 fixed bottom-4 xl:bottom-10  left-1/2  -translate-x-1/2 py-2 justify-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-1 lg:gap-4 p-1 lg:p-4 shadow-lg bg-white w-fit rounded-full flex-wrap"
      >
        {others
          .slice(0, limit)
          .filter((el) => el.presence?.profile)
          .map((el, index) => {
            const profile = el.presence?.profile;
            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border flex items-center gap-1 border-dashed border-primary-01 group relative rounded-full hover:border-pastel-pink cursor-pointer"
                key={profile.id}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-pastel-pink/5 flex items-center justify-center "
                >
                  <img className="w-6 h-6lg:w-10 lg:h-10 rounded-full object-contain" src={createImage(profile.avatar, 100)} />
                </motion.div>
                <span className="text-sm absolute bottom-full left-full px-2 py-1 group-hover:z-10 pointer-events-none group-hover:pointer-events-auto  duration-300 opacity-0 group-hover:opacity-100 rounded-md bg-primary-01 text-white  whitespace-nowrap ">
                  {profile.name}
                </span>
              </motion.div>
            );
          })}
        {userCount > limit && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 5 * 0.1 }}
            className="border flex items-center gap-1 border-dashed border-primary-01 group relative rounded-full hover:border-pastel-pink cursor-pointer"
            key={profile.id}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-pastel-pink/5 flex items-center justify-center "
            >
              {userCount - limit}
            </motion.div>
            <span className="text-sm absolute bottom-full left-full px-2 py-1 group-hover:z-10 pointer-events-none group-hover:pointer-events-auto  duration-300 opacity-0 group-hover:opacity-100 rounded-md bg-primary-01 text-white  whitespace-nowrap ">
              {profile.name}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ListOnline;
