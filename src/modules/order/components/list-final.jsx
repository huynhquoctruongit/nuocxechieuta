import useOrder from "../helper/use-menu";
import { ItemTable } from "./list-order";
import groupBy from "lodash/groupBy";
const options = [
  { title: "Món", value: "mon", className: "w-5/12" },
  { title: "Cơm", value: "ss", className: "w-2/12" },
  { title: "Lưu ý", value: "note", className: "w-5/12" },
];

const NumberOval = ({ children }) => {
  return (
    <div className="w-6 h-6 rounded-full border border-dashed border-gray-500 text-xs flex items-center justify-center">
      {children}
    </div>
  );
};

const Item = ({ number, title }) => {
  return (
    <div className="flex gap-2">
      <NumberOval>{number}</NumberOval>
      {title}
    </div>
  );
};
// enumFood;
const ListFinal = ({ order }) => {
  const { orders } = useOrder();
  const groupedData = groupBy(orders, "name");
  const getClass = (index) => {
    return options[index].className;
  };
  return (
    <div className="w-full border border-pastel-pink rounded-md mt-10">
      <div className="flex items-center justify-center">
        {options.map((option, index) => {
          return (
            <ItemTable className={option.className + " font-bold text-gray-600 border-pastel-pink"} key={index + "-option"}>
              {option.title}
            </ItemTable>
          );
        })}
      </div>
      <div className="">
        {Object.keys(groupedData).map((key, index) => {
          const items = groupedData[key];
          const group = groupBy(items, "price");
          return (
            <div key={key} className="flex items-stretch border-pastel-pink border-t text-gray-500 text-md">
              <ItemTable className={getClass(0) + " gap-2 border-pastel-pink"}>
                <div className="flex gap-2">
                  <NumberOval>{items.length}</NumberOval>
                  {key}
                </div>
              </ItemTable>
              <ItemTable className={getClass(1) + " gap-2 border-pastel-pink"}>
                <div className="flex flex-col gap-2">
                  {Object.keys(group).map((keyx, index) => {
                    const item = group[keyx];
                    if (keyx !== "25") return null;
                    return <Item key={index + key} number={item.length} title={keyx === "25" ? "Không cơm" : "Có cơm"} />;
                  })}
                </div>
              </ItemTable>
              <ItemTable className={getClass(2) + " gap-2 border-pastel-pink"}>
                <div className="flex flex-col gap-4">
                  {items.map((item, index) => {
                    if (!item.note) return null;
                    return (
                      <div key={index + key} className="flex items-center gap-3">
                        <div className="w-fit h-6 items-center flex px-2 text-sm rounded-full border border-dashed border-gray-700">
                          1 phần
                        </div>
                        {item.note}
                      </div>
                    );
                  })}
                </div>
              </ItemTable>
            </div>
          );
        })}
        <div className="flex py-2 items-stretch border-pastel-pink border-t text-gray-500 text-md bg-pastel-pink/20">
          <ItemTable>
            {orders?.length > 0 && (
              <div className="flex items-center gap-3">
                Tổng cộng:
                <img src="/images/bird.png" className="w-10" alt="" />
                <div className="w-fit px-4 h-8 items-center justify-center flex rounded-full border border-gray-200 border-dashed relative ">
                  <span className="ml-2">{orders?.length} Phần</span>
                </div>
                {/* <img src="/images/bird2.png" className="w-10" alt="" /> */}
              </div>
            )}
          </ItemTable>
        </div>
      </div>
    </div>
  );
};

export default ListFinal;
