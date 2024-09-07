import UserProfile from "@/components/widget/user";
import { useSubscribe } from "@/hooks/use-connection";
import { createImage } from "@/lib/helper";
import { useRef } from "react";
import useSWR from "swr";
const top = [
  { img: "/top/top-1.png", title: "Thông hiểu cả trời đất" },
  { img: "/top/top-2.png", title: "Trên thông thiên văn dưới tường địa lý" },
  { img: "/top/top-3.png", title: "Đa mưu túc trí" },
  { img: "/top/top-4.png", title: "Sáng suốt như rồng bay" },
  { img: "/top/top-5.png", title: "Tài năng vững như bàn thạch" },
];

const ListUserPoint = () => {
  const limit = 5;
  const { data, mutate } = useSWR(`/items/statictis_user?fields=*,user.*&sort=-point&limit=${limit}`);
  const listAnswer = data?.data || [];

  const callback = useRef(null);
  callback.current = (data) => {
    const payload = data?.data[0];
    if (!payload) return;
    const newData = [...listAnswer];
    const index = newData.findIndex((item) => item.id === payload.id);
    if (index === -1 && payload) newData.push(payload);
    if (index !== -1) newData[index] = payload;
    mutate({ data: newData.sort((a, b) => b.point - a.point) }, { revalidate: false });
  };
  useSubscribe("update", "statictis_user", ["*,user.*"], {}, callback);
  return (
    <div className="flex flex-col gap-4">
      {listAnswer.slice(0, limit).map((item, index) => {
        const profile = item?.user || {};
        const fullname = profile.first_name + " " + profile.last_name + "";
        const viewFullname = fullname.length > 20 ? fullname.slice(0, 20) + "..." : fullname;
        const detail = top[index];

        return (
          <div key={item.id} className="flex items-center gap-2 group relative">
            <span className="text-xl font-bold text-primary-01"> {index + 1}.</span>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pastel-pink/50 p-1 shadow">
                <img className="w-8 h-8 rounded-full" src={createImage(profile.avatar, 100)} />
              </div>
              <div>
                <div className="text-lg text-gray-600 font-bold"> {viewFullname}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2 ">
                  <span>{item.point} Điểm</span>/<span className="text-green-600"> {item.count_correct}</span>/
                  <span className="text-red-400"> {item.count_incorrect}</span>
                </div>
              </div>
            </div>
            <div
              // style={{ opacity: index === 0 ? 1 : 0 }}
              className="absolute opacity-0 pointer-events-none shadow-2xl group-hover:opacity-100 group-hover:pointer-events-auto translate-y-1 group-hover:translate-y-0 duration-300 top-0 right-full w-96 h-fit p-4 rounded-lg border border-primary-01 bg-white"
            >
              <div className="flex items-start gap-10">
                <img className="w-16 min-w-16" src={detail.img} alt={detail.title} />
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-bold">{fullname}</div>
                  <div className="text-sm text-gray-500 -translate-y-2">{detail.title}</div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary-01 leading-relaxed">{item.point}</div>
                      <span className="text-xs">Điểm</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{item.count_correct}</div>
                      <span className="text-xs">Đúng</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">{item.count_incorrect}</div>
                      <span className="text-xs">Sai</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListUserPoint;
