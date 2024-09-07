"use client"
import { Button } from "@/components/common/button-hero";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useCompany } from "@/hooks/use-company";
import { Settings, SquareKanban } from "lucide-react";
import { useRef, useState } from "react";
import AxiosClient from "@/lib/api/axios-client";
import { useToast } from "@/components/common/use-toast";
import CreateMenu, { SplitButton } from "./create-menu";
import { useRouter } from 'next/navigation'
import { PresentationChartBarIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";

const EditCompany = () => {
  const [openConfig, setOpenConfig] = useState(false);
  const navigate = useRouter();
  const { profile } = useAuth();
  const { company, isLoading } = useCompany();
  const refMenu = useRef();
  if (isLoading || !profile.permission_to_create_menu) return;
  return (
    <>
      <div className="bg-pastel-pink/40 ">
        <div className="root-wrapper py-4 flex justify-end gap-2 md:gap-4 flex-wrap">
          <Button
            variant="secondary"
            size="default"
            className="relative"
            onClick={() => navigate.push("/report?week=this_week")}
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <SquareKanban className="w-4 h-4" /> <span className="hidden md:block">Quản lý công ty</span>
            </span>
          </Button>
          <Button variant="secondary" size="default" className="relative" onClick={() => refMenu.current.setOpen(true)}>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <SquaresPlusIcon className="w-4 h-4" /> <span className="hidden md:block">Thêm menu</span>
            </span>
          </Button>

          <CreateMenu refMenu={refMenu} />
          {(profile.id === company.admin?.id || profile.permission_to_create_menu) && (
            <div className="flex items-center gap-2">
              <SplitButton />
              <div
                className="w-10 h-10 flex items-center justify-center rounded-md bg-white cursor-pointer shadow-sm"
                onClick={() => setOpenConfig(true)}
              >
                <Settings className="stroke-slate-500" />
              </div>
            </div>
          )}
        </div>
      </div>
      <ConFig open={openConfig} onOpenChange={setOpenConfig} />
    </>
  );
};

const ConFig = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { company, mutate } = useCompany();
  const { destructive, success } = useToast();
  const order_time_limit = company?.order_time_limit?.split(":") || [0, 0];

  const [form, setForm] = useState({
    name: company?.name,
    address: company?.address,
    description: company.description,
    hour: order_time_limit[0],
    minute: order_time_limit[1],
  });

  const onChangeData = (name) => {
    return (e) => {
      setForm((prev) => ({ ...prev, [name]: e.target.value }));
    };
  };

  const onChangeBlur = (name) => {
    return (e) => {
      const value = parseInt(e.target.value);
      setForm((prev) => ({ ...prev, [name]: value > 10 ? value : "0" + value }));
      if (name === "hour" && (value < 0 || value > 24)) setForm((prev) => ({ ...prev, [name]: 12 }));
      if (name === "minute" && (value < 0 || value > 60)) setForm((prev) => ({ ...prev, [name]: "00" }));
    };
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const payload = { ...form, order_time_limit: `${form.hour}:${form.minute}:00`, hour: undefined, minute: undefined };

    await AxiosClient.patch(`/items/company/${company.id}`, payload).catch(() => {
      destructive("Có lỗi xảy ra");
    });
    await mutate();
    success("Cập nhật thành công");
    onOpenChange(false);
    setIsLoading(false);
  };
  return (
    <Dialog open={open} className="" onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[500px] bg-white text-black bg-[url(/background-auth.png)] bg-cover"
      >
        <div className="py-10">
          <div>
            <Label className="text-base font-normal">Tên công ty</Label>
            <Input
              value={form.name}
              onChange={onChangeData("name")}
              type="text"
              placeholder="Vui lòng nhập tên công ty"
              className="w-full mt-2"
            />
          </div>
          <div className="mt-4">
            <Label className="text-base font-normal">Địa chỉ công ty</Label>
            <Input
              value={form.address}
              onChange={onChangeData("address")}
              type="text"
              placeholder="Vui lòng nhập địa chỉ công ty"
              className="w-full mt-2"
            />
          </div>
          <div className="mt-4">
            <Label className="text-base font-normal">Mô tả ngắn nè</Label>
            <Textarea
              value={form.description}
              type="text"
              onChange={onChangeData("description")}
              placeholder="Vui lòng nhập địa chỉ công ty"
              className="w-full mt-2"
            />
          </div>
          <div className="mt-4">
            <Label className="text-base font-normal">Thời gian kết thúc</Label>
            <div className="flex items-center gap-3">
              <Input
                value={form.hour}
                onChange={onChangeData("hour")}
                onBlur={onChangeBlur("hour")}
                placeholder="Giờ"
                className="w-full mt-2"
              />
              :
              <Input
                value={form.minute}
                onBlur={onChangeBlur("minute")}
                onChange={onChangeData("minute")}
                placeholder="Phút"
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="items-center flex gap-4">
            Hủy
          </Button>
          <Button disabled={isLoading} onClick={onSubmit} className="items-center flex gap-4">
            {isLoading ? "Đang cập nhật" : "Cập nhật"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompany;
