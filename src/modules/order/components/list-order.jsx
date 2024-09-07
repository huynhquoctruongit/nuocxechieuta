import dayjs from "dayjs";
import { XIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { enumFood } from "@/lib/utils";
import groupBy from "lodash/groupBy";
import { useAuth } from "@/hooks/use-auth";
import useOrder from "../helper/use-menu";
import { useToast } from "@/components/common/use-toast";
import { connection } from "@/lib/directus";
import { useCompany } from "@/hooks/use-company";

export const ItemTable = ({ children, className }) => {
  return (
    <div className={className + " text-left border-r border-gray-300 last:border-none"}>
      <div className="py-3 px-5 h-full flex items-center">{children}</div>
    </div>
  );
};
const options = [
  { title: "Sen", value: "dongchi", className: "w-4/12" },
  { title: "Món", value: "mon", className: "w-4/12" },
  { title: "Ghi chú", value: "ghi-chu", className: "w-3/12" },
  { title: "Thời gian", value: "date-luc", className: "w-2/12" },
  { title: "Tổng", value: "tong", className: "w-2/12" },
];
const ListOrder = () => {
  const { orders } = useOrder();
  const { profile } = useAuth();
  const { company } = useCompany();

  const { toast } = useToast();
  const groups = groupBy(orders, "user_created.id");
  const list = Object.keys(groups).map((key) => {
    const items = groups[key];
    return {
      user: items[0].user_created,
      items: items,
    };
  });

  const deleteFood = (item) => {
    const now = dayjs();
    const [hour_limit, minute_limit] = (company?.order_time_limit || "13:30:00").split(":");
    const time = now.hour(hour_limit).minute(minute_limit).second(0).millisecond(0).unix();
    const valid = dayjs().unix() < time;
    if (!valid) {
      toast({
        variant: "destructive",
        title: "Hết giờ rồi",
        description: "Thui ăn xong rồi ai lại hủy nữa :)))",
      });
      return;
    }
    // AxiosClient.patch("/items/order/" + item.id, {
    //   status: "draft",
    // });
    connection.sendMessage({
      type: "items",
      collection: "order",
      action: "update",
      data: { status: "draft" },
      id: item.id,
    });
  };

  const md = useMediaQuery("(min-width: 768px)");
  if (md)
    return (
      <div className="w-full border border-gray-300 rounded-md">
        <div className="flex items-center w-full">
          {options.map((option, index) => {
            return (
              <ItemTable className={option.className + " font-bold text-gray-600"} key={index + "-option"}>
                {option.title}
              </ItemTable>
            );
          })}
        </div>
        <div>
          {list?.map((elm, index) => {
            const fullname = elm.user.first_name + " " + elm.user.last_name;
            return (
              <div key={index + "-elm"} className="flex items-stretch border-gray-300 border-t text-gray-500 text-md">
                <ItemTable className={options[0].className}>
                  <div className="flex items-center gap-2 w-full">
                    <img src={enumFood[index % enumFood.length]} alt="" className="w-10 h-10 rounded-md border-2 border-white" />
                    <span>{fullname}</span>
                  </div>
                </ItemTable>
                <ItemTable className={options[1].className}>
                  <div className="flex flex-col gap-2">
                    {elm.items.map((el, index) => {
                      return (
                        <div key={el.name + index + "name"} className="flex items-center">
                          <span className="mr-3"> - {el.name} </span>
                          {profile.id == elm.user.id && (
                            <div
                              onClick={() => {
                                deleteFood(el);
                              }}
                              className="ml-auto bg-[#E5624D] min-w-4 w-4 h-4 rounded-lg  flex items-center justify-center cursor-pointer  hover:shadow-button"
                            >
                              <XIcon className="w-3 h-3 stroke-white " />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ItemTable>
                <ItemTable className={options[2].className}>
                  <div className="flex flex-col gap-2">
                    {elm.items.map((el, index) => {
                      return (
                        <div key={el.note + "note" + index}>
                          {el.note ? "-" : ""}
                          {el.note || " "}
                        </div>
                      );
                    })}
                  </div>
                </ItemTable>
                <ItemTable className={options[3].className}>
                  <div className="flex flex-col gap-2">
                    {elm.items.map((el, index) => (
                      <div key={el.date_created + "note" + index}>{dayjs(el.date_created).format("HH:mm")}</div>
                    ))}
                  </div>
                </ItemTable>
                <ItemTable className={options[4].className}>
                  {elm.items.reduce((total, item) => total + parseInt(item.price), 0)} cá
                </ItemTable>
              </div>
            );
          })}
        </div>
      </div>
    );
  return (
    <div>
      <div className="text-xl text-left mb-4">Danh sách đặt món</div>
      <div className="border border-dashed border-gray-200 px-1 rounded-md">
        {list?.map((elm, index) => {
          const fullname = elm.user.first_name + " " + elm.user.last_name;

          return (
            <div key={index + "-elm"} className="flex flex-col gap-2 border-b border-gray-200 last:border-b-0 pb-4 mb-2">
              <div className="flex items-center gap-2 w-full">
                <img src={enumFood[index % enumFood.length]} alt="" className="w-10 h-10 rounded-md border-2 border-white" />
                <span>{fullname}</span>
              </div>
              <div className="flex flex-col gap-2">
                {elm.items.map((el, index) => {
                  return (
                    <div key={el.name + index + "name"} className="flex items-center">
                      <span className="mr-3"> -{el.name} </span>
                      {profile.id == elm.user.id && (
                        <div
                          onClick={() => {
                            deleteFood(el);
                          }}
                          className="ml-auto bg-[#E5624D] min-w-4 w-4 h-4 rounded-lg  flex items-center justify-center cursor-pointer  hover:shadow-button"
                        >
                          <XIcon className="w-3 h-3 stroke-white " />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListOrder;
