import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import HeroHeader from "@/components/widget/hero";
import TablePink from "@/components/widget/table-pink";
import useHistory from "@/hooks/use-order";
import groupBy from "lodash/groupBy";
import ChartPrice from "../component/chart-price";
import LabelInfo from "../component/info";
dayjs.extend(isoWeek);

const optionss = [
  { title: "Thứ 2", value: 2, className: "w-2/12 py-1.5 " },
  { title: "Thứ 3", value: 3, className: "w-2/12 py-1.5" },
  { title: "Thứ 4", value: 4, className: "w-2/12 py-1.5" },
  { title: "Thứ 5", value: 5, className: "w-2/12 py-1.5" },
  { title: "Thứ 6", value: 6, className: "w-2/12 py-1.5" },
  { title: "Tổng kết", value: "total", className: "w-2/12 py-1.5" },
];
const ReportByUser = () => {
  const { history, isLoading } = useHistory(100, 1);
  const list = history
    .map((element) => {
      const startWeek = dayjs(element.date_created).startOf("isoWeek");
      return {
        ...element,
        startWeek: startWeek.format("DD/MM/YYYY"),
        startWeekUnix: startWeek.unix(),
        dayOfWeek: dayjs(element.date_created).isoWeekday() + 1,
      };
    })
    .sort((a, b) => b.startWeekUnix - a.startWeekUnix);

  const listGroup = groupBy(list, "startWeek");
  const listWeek = Object.keys(listGroup).map((key) => [...listGroup[key]]);
  const render = (key, value) => {
    const item = value?.find((element) => element.dayOfWeek === key);
    if (key === "total") {
      const count = value.reduce((total, item) => total + parseInt(item.price) + (item.delivery_fee || 0), 0);
      return (
        <div>
          <div className="flex items-center">
            <div>Cơm: </div>
            <div className="flex text-sm font-semibold px-1.5 py-0.5 text-primary-01 rounded-full bg-pastel-pink/40 ml-2">
              {count} cá
            </div>
          </div>
        </div>
      );
    }
    if (!item) return null;
    return (
      <div className="text-xs md:text-sm">
        <div className="mb-4 text-sm text-gray-900"> {dayjs(item.date_created).format("DD/MM/YYYY")} </div>
        <div className="flex items-center">
          <div className="flex text-xs px-1.5 py-0.5 text-primary-01 rounded-full bg-pastel-pink/40">{item.price} cá</div>
        </div>
        <div className=" text-gray-400 mt-2"> {item.name}</div>
      </div>
    );
  };
  if (isLoading) return null;
  return (
    <div className="">
      <HeroHeader
        title="Lịch sử ăn dằm nằm dề"
        description="Nhìn bụng biết bụng ăn bao nhiêu! Nhìn bạn biết bạn mặp bấy nhiêu"
      />
      <div className="root-wrapper my-10">
        <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-10 mb-20 items-stretch w-full">
          <ChartPrice />
          <LabelInfo />
        </div>
        <div className="flex flex-col gap-20 ">
          {listWeek.map((item, index) => {
            return (
              <div className="">
                <div className="text-left font-bold mb-8 text-lg rounded-md border border-dashed border-primary-01 w-fit px-2 py-1">
                  <span className="text-lg  text-primary-01"> Tuần thứ {dayjs(item[0].date_created).isoWeek()} </span>
                  {item[0].startWeek} -{" "}
                  {dayjs(item[0].startWeekUnix * 1000)
                    .add(6, "day")
                    .format("DD/MM/YYYY")}
                </div>
                <TablePink key={index} headers={optionss} list={[item]} render={render} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ReportByUser;
