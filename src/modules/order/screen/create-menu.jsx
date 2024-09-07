"use client"
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlusCircle, TableCellsSplitIcon, XIcon } from "lucide-react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import useImage from "../helper/use-image";
import { createImage, sleep } from "@/lib/helper";
import { v4 as uuidv4 } from "uuid";
import { Button as ButtonHero } from "@/components/common/button-hero";
import { useParams } from "next/navigation";
import AxiosClient from "@/lib/api/axios-client";
import { useMenuToday } from "@/hooks/use-menu";
import { useToast } from "@/components/common/use-toast";
import useConvertImage from "../helper/use-convert-image";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import useOrder from "../helper/use-menu";
import { useCompany } from "@/hooks/use-company";

const CreateMenu = ({ refMenu }) => {
  const { providerId, companyId } = useParams();
  const { profile } = useAuth();
  const { menu, mutate, provider } = useMenuToday();
  const { destructive, success } = useToast();
  const { getRandImage } = useImage("avatar");
  const [open, setOpen] = useState(false);
  const [foods, setFoods] = useState([]);
  const ref = useRef();
  const { handleFileChange, isLoading, listFood } = useConvertImage();

  useImperativeHandle(refMenu, () => ({
    setOpen: (value) => {
      if (profile.permission_to_create_menu !== true) {
        destructive("Bạn không có quyền tạo menu");
        return;
      }
      setOpen(value);
    },
  }));

  const createFood = async () => {
    const newFood = {
      name: "",
      image: getRandImage(),
      uuid: uuidv4(),
      dish_price: provider?.dish_price,
      side_dish_price: provider?.side_dish_price,
    };
    setFoods([...foods, newFood]);
    await sleep(100);
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  };
  const deleteFood = (index) => {
    const newFoods = [...foods];
    newFoods.splice(index, 1);
    setFoods(newFoods);
  };
  const onChange = (index, key, value) => {
    const newFoods = [...foods];
    newFoods[index][key] = value;
    setFoods(newFoods);
  };
  const createMenu = async () => {
    setOpen(false);
    if (menu.id) {
      await AxiosClient.patch(`/items/menu/${menu.id}`, {
        detail: foods.filter((item) => item.name),
      });
    } else {
      await AxiosClient.post("/items/menu", {
        bulk_food_provider: providerId,
        company_id: companyId,
        detail: foods.filter((item) => item.name),
      });
    }
    success("Tạo danh sách món thành công");
    mutate();
  };
  useEffect(() => {
    if (menu.bulk_food_provider) {
      const detail = menu.detail;
      setFoods(detail);
    }
  }, [menu]);

  useEffect(() => {
    if (isLoading === false && listFood.length > 0) {
      setFoods(listFood);
    }
  }, [listFood, isLoading]);
  return (
    <>
      <Dialog open={open} className="" onOpenChange={setOpen}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[1000px] bg-white text-black bg-[url(/background-auth.png)] bg-cover"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="hidden lg:block">Tạo danh sách món</div>
            <input type="file" id="files" className="hidden" onChange={handleFileChange} />
            <label
              htmlFor="files"
              className="w-fit flex ml-3 items-center rounded-full border border-dashed border-gray-500 py-2 px-4"
            >
              <img src="/images/meo-hut-sua.png" className="w-6 object-cover h-6 rounded-md mx-auto text-gray-400 mr-2" />
              <span className="text-gray-500 text-sm">Thêm danh sách bằng hình</span>
            </label>
          </div>
          <div className="max-h-[60vh] overflow-y-scroll" ref={ref}>
            {foods.length === 0 && !isLoading && (
              <div className="flex items-center border border-gray-300 border-dashed justify-center flex-col gap-4 py-10 rounded-md">
                <img src="/images/not-found.png" className="w-32 h-32 object-cover" alt="" />
                <span>Chưa có món</span>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center border border-gray-300 border-dashed justify-center flex-col gap-4 py-10 rounded-md">
                <img src="/images/not-found.png" className="w-32 h-32 object-cover" alt="" />
                <span>Đang tải món</span>
              </div>
            )}
            {foods.length !== 0 && !isLoading && (
              <div className="grid grid-cols-1 xl:grid-cols-2 p-4 bg-white rounded-md gap-4 py-4 md:py-10">
                {foods.map((food, index) => (
                  <div className="border border-gray-300 rounded-xl duration-200 text-sm" key={food.uuid}>
                    <div className="p-4 flex items-center gap-4 bg-pastel-pink/20 rounded-t-md">
                      <img src={createImage(food.image, 300)} className="w-8 h-8 object-cover rounded-md" />
                      <input
                        value={food.name}
                        type="text"
                        onChange={(e) => onChange(index, "name", e.target.value)}
                        className="focus:outline-none text-sm w-full bg-transparent"
                        placeholder="Tên món nè "
                      />
                      <div
                        onClick={() => deleteFood(index)}
                        className="min-w-5 w-5 h-5 bg-white border cursor-pointer border-slate-100 rounded-full flex items-center justify-center"
                      >
                        <XIcon className="w-3 h-3 stroke-gray-500" />{" "}
                      </div>
                    </div>
                    <div className="border-t border-gray-300"></div>
                    <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
                      <input
                        value={food.dish_price}
                        onChange={(e) => onChange(index, "dish_price", e.target.value)}
                        type="number"
                        className="focus:outline-none px-3 py-1.5 text-sm rounded-sm border  border-gray-300  hover:border-pastel-pink "
                        placeholder="Giá có cơm (35)"
                      />
                      <div className="relative w-full">
                        <input
                          value={food.side_dish_price}
                          onChange={(e) => onChange(index, "side_dish_price", e.target.value)}
                          type="text"
                          className="focus:outline-none px-3 py-1.5 text-sm rounded-sm border  border-gray-300  hover:border-pastel-pink w-full"
                          placeholder="Giá không cơm (20)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="" onClick={createFood}>
              <div className="rounded-full px-3 py-1.5 border border-dashed border-gray-300 cursor-pointer"> Thêm món </div>
            </div>
            <ButtonHero disabled={isLoading} onClick={createMenu} className="items-center flex gap-4">
              Tạo danh sách món
              <PlusCircle />
            </ButtonHero>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const SplitButton = () => {
  const { profile } = useAuth();
  const [split, setSplit] = useState(false);
  const { company } = useCompany();
  const admin = company?.admin || {};

  const { mutate } = useOrder();
  const text = useRef();
  const { success } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async () => {
    setIsLoading(true);
    const result = await mutate();
    const orders = result?.data || [];
    const delivery_fee = Math.ceil((text.current.value || 0) / orders.length);

    await AxiosClient.patch(
      "/items/order",
      orders.map((item) => ({ id: item.id, delivery_fee })),
    );
    success("Chia tiền thành công"), setIsLoading(false);
    setSplit(false);
  };
  if (!profile.permission_to_create_menu) return null;
  return (
    <>
      {(profile.uuid === admin.uuid || profile.permission_to_create_menu) && (
        <ButtonHero variant="secondary" size="default" className="relative flex items-center gap-2" onClick={() => setSplit(true)}>
          <TableCellsSplitIcon className="w-4 h-4" />
          <span className="hidden md:block"> Chia tiền </span>
        </ButtonHero>
      )}
      <Dialog open={split} className="" onOpenChange={setSplit}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[400px] bg-white text-black bg-[url(/background-auth.png)] bg-cover"
        >
          <div className="py-10">
            <Input ref={text} type="number" placeholder="Nhập số tiền ship" className="w-full" />
            <i className="mt-2 block text-xs text-gray-500">Chỉ nên nhập chia tiền khi đã chốt danh sách món ăn nhé </i>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div></div>
            <ButtonHero disabled={isLoading} onClick={onSubmit} className="items-center flex gap-4">
              {isLoading ? "Đang chia" : " Chia tiền "}
            </ButtonHero>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateMenu;
