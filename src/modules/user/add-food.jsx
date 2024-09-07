import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

const AddFood = ({}) => {
  const { isLogin } = useAuth();
  const listItem = [
    { label: "Vui", image: "/vui.png" },
    { label: "Vui vãi", image: "/vui-vai.png" },
    { label: "Vui ít ít", image: "/vui-it-it.png" },
    { label: "Cũng được", image: "/cung-duoc.png" },
  ];
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isLogin) {
      setShow(true);
    }
  }, [isLogin]);

  return (
    <Dialog open={show}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-primary">Bảng đánh giá tâm trạng</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4 text-center">Tâm trạng của bạn hôm nay như thế nào?</div>
        <div className="flex items-center justify-between">
          {listItem.map((item, index) => (
            <div
              key={item.label}
              onClick={() => setShow(false)}
              className="flex flex-col items-center justify-center group cursor-pointer"
            >
              <img
                src={item.image}
                className="w-10 h-10 object-cover group-hover:animate-spin"
                style={{ animationDuration: "0.2s" }}
                alt=""
              />
              <div className="text-center text-sm mt-2">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-600 py-4 text-center">
          <img className="h-20 w-20 mx-auto my-2 rounded-md" src="/images/ai-loading.gif" alt="" />
          AI của chúng tôi đang lựa món <br /> dựa trên tâm trạng của bạn
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AddFood;
