import useMenuToday from "@/hooks/use-menu";
import { cn, enumFood } from "@/lib/utils";
import { useMemo } from "react";
import useImage from "../helper/use-image";
import { createImage } from "@/lib/helper";
import { useCompany } from "@/hooks/use-company";

const ListFood = ({ onSelectFood }) => {
  const { menu, isLoading } = useMenuToday();
  const { getRandImage } = useImage("juice");
  const { getRandImage: getRandImageAvatar } = useImage("avatar");

  const provider = menu.bulk_food_provider;
  const listFood = menu?.detail;

  const expand = listFood?.length > 9;
  const generateFood = provider?.type === "drink" ? getRandImage : getRandImageAvatar;
  return (
    <div className="flex flex-col md:flex-row gap-4 relative items-stretch z-0">
      <img className="absolute z-0 top-0 right-10 w-64 opacity-70" src="/images/bg-opacity.png" />
      {!expand && (
        <div className="w-full md:w-1/5 relative">
          <img className="w-40 mx-auto md:w-full" src="/images/book.png" alt="" />
        </div>
      )}
      <div className={expand ? "md:w-5/5" : "w-full md:w-4/5"}>
        <div className="w-full flex flex-wrap gap-4 relative z-10">
          {listFood?.length === 0 && !isLoading && (
            <div className="rounded-2xl bg-pastel-pink/10 h-full w-full p-10">
              <div className="text-lg">Đợi Idol Hồng Phạm thêm menu cái nhóa</div>
              <div className="mx-auto w-fit flex flex-items-center gap-2 mt-10">
                {enumFood.slice(5, 10).map((elm, index) => {
                  return <img key={index + "-elm"} src={elm} className="aspect-square w-12 bg-pastel-pink/30 rounded-md" alt />;
                })}
              </div>
            </div>
          )}
          {listFood?.map((elm, index) => {
            return (
              <ItemFood
                expand={expand}
                index={index}
                elm={elm}
                onSelectFood={onSelectFood}
                generateFood={generateFood}
                key={index + "-elm"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ItemFood = ({ elm, onSelectFood, generateFood, expand, index }) => {
  const image = useMemo(() => createImage(generateFood(), 400), [elm.id]);
  return (
    <div
      key={index + "-elm"}
      onClick={() => onSelectFood(elm)}
      className={cn(
        "rounded-lg border relative border-gray-300 w-full flex items-center gap-2 hover:border-pastel-pink hover:shadow-button-small duration-200 cursor-pointer",
        expand ? "md:w-[calc((100%-60px)/4)]" : "md:w-[calc((100%-60px)/3)] ",
      )}
    >
      <div className="h-[100px] aspect-square bg-[#FFCFC8]/20 flex items-center flex-col justify-center">
        <img className="w-[70px]" src={image} alt="" />
      </div>
      <div className="p-1 h-full flex flex-col ">
        <div className="mb-1 flex gap-0.5">
          <div className="text-[10px] mt-2 text-left bg-pastel-pink/60 text-primary-01 w-fit rounded-md px-1">
            {elm.dish_price} cá
          </div>
        </div>
        <div className="text-left text-sm text-gray-700 line-clamp-3">{elm.name}</div>
      </div>
    </div>
  );
};

export default ListFood;
