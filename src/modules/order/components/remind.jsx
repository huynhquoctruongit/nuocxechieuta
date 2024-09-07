import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";
import useStateModal from "@/hooks/use-modal";
import { useOdersIsNotPaid } from "../../../hooks/use-order";
import { useCompany } from "@/hooks/use-company";
import TablePink from "@/components/widget/table-pink";
import dayjs from "dayjs";
import { createImage } from "@/lib/helper";
import { Button } from "@/components/common/button-hero";
import AxiosClient from "@/lib/api/axios-client";

const ModalRemind = () => {
  const { openRemind, setOpenRemind } = useStateModal((state) => ({
    openRemind: state.openRemind,
    setOpenRemind: state.setOpenRemind,
  }));
  const { company } = useCompany();
  const admin = company?.admin || {};
  const fullname = admin?.first_name + " " + admin.last_name;
  const { orders, mutate } = useOdersIsNotPaid();

  const currentDay = dayjs().day();
  const weekEnd = dayjs().add(currentDay * -1, "day");

  const orderOldWeek = orders.filter((item) => {
    dayjs(item.date_created).isBefore(dayjs().subtract(1, "week"));
    return weekEnd.isAfter(dayjs(item.date_created));
  });
  const listOrder = company.type_payment === "daily" ? orders : orderOldWeek;
  useEffect(() => {
    if (listOrder.length > 0 && company.type_payment === "daily") {
      setOpenRemind(true);
    }
    if (orderOldWeek.length > 0 && company.type_payment === "weekly") {
      setOpenRemind(true);
    }
  }, [orders]);
  const headers = [
    { title: "Thời gian", value: "time", className: "w-4/12 text-sm" },
    { title: "Món", value: "name", className: "w-5/12 text-sm" },
    { title: "Tiền", value: "money", className: "w-4/12 text-sm" },
  ];

  const onSubmit = async () => {
    // const payload = orders.map((item) => ({
    //   id: item.id,
    //   is_paid: true,
    // }));
    // await AxiosClient.patch("/items/order", payload);
    mutate();
    setOpenRemind(false);
  };
  const render = (key, value) => {
    switch (key) {
      case "time":
        return <div className="text-xs md:text-sm">{dayjs(value.date_created).format("HH:mm:ss DD/MM/YYYY")}</div>;
      case "name":
        return <div className="text-xs md:text-sm">{value.name}</div>;
      case "money":
        return (
          <div className="text-xs md:text-sm">
            <div>
              Cơm: <i className="ml-1"> {value.price} Cá </i>
            </div>
            <div className="whitespace-nowrap">
              Ship: <i className="ml-1">{value.delivery_fee || 0} Cá</i>
            </div>
          </div>
        );
    }
  };
  return (
    <>
      <Dialog open={openRemind} className="" onClose={setOpenRemind}>
        <DialogContent
          hiddenClose
          className="sm:max-w-[800px] max-w-[calc(100%-40px)] bg-white text-black bg-[url(/background-auth.png)] bg-cover"
        >
          <DialogHeader>
            <DialogTitle className="text-black">Thông báo ít có giá trị 🖖</DialogTitle>
          </DialogHeader>
          <div className="py-4 w-full mx-auto mt-4 max-h-[80vh] overflow-y-scroll">
            <div className="mb-2 italic text-sm">
              Chuyển tiền sớm để <span className="inline-block px-1 py-0.5 rounded-sm -skew-x-6 bg-pastel-pink">{fullname}</span>{" "}
              không bị thất thoát tài sản nhé 🤘
            </div>
            <div className="italic text-sm mb-5">
              Nếu đã chuyển vui lòng bấm <b>Thanh toán xong</b> để hệ thống cập nhật thông tin nhé
            </div>

            <div className="flex gap-4 flex-col-reverse md:flex-row justify-center items-stretch">
              <div>
                <img className="w-60 mx-auto rounded-md object-cover " src={createImage(admin.qr_code_for_payment, 500)} alt="" />
              </div>
              <div className="flex flex-col">
                <div className="md:max-h-[300px] overflow-y-auto">
                  <TablePink headers={headers} list={listOrder} render={render} />
                </div>
                <div className="mt-4">
                  Tổng cần thanh toán:{" "}
                  <span className=" ">
                    {listOrder.reduce((total, item) => total + parseInt(item.price) + (parseInt(item.delivery_fee) || 0), 0)}{" "}
                  </span>
                  Cá
                </div>
                <div className="mt-auto hidden md:block text-right">
                  <Button onClick={onSubmit}>Thanh toán xong</Button>
                </div>
              </div>
            </div>
            <div className=" md:hidden mt-10  text-center">
              <Button onClick={onSubmit}>Thanh toán xong</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalRemind;
