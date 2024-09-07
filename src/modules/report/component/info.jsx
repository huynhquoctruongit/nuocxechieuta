import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import useSWR from "swr";

const LabelInfo = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        // delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const { profile } = useAuth();
  const payloadHistory = {
    filter: { company: { _eq: profile.company }, status: { _eq: "published" }, user_created: { _eq: profile.id } },
    limit: 5,
  };
  const payload = {
    filter: { company: { _eq: profile.company }, status: { _eq: "published" }, user_created: { _eq: profile.id } },
    aggregate: { sum: ["price", "delivery_fee"], count: ["id"] },
  };
  const { data: report } = useSWR(["/items/order", payload]);
  const { data: historyRes } = useSWR(["/items/order", payloadHistory]);
  const list = report?.data || [];
  const total = list.reduce((total, item) => total + parseInt(item.sum.price || 0) + (parseInt(item.sum.delivery_fee) || 0), 0);
  const totalOlder = list.reduce((total, item) => total + parseInt(item.count.id || 0), 0);
  const history = historyRes?.data || [];
  const again = Array.from({ length: 5 - history.length }, (_, i) => ({ id: i, name: "" }));

  return (
    <div className="w-full flex-1 relative text-left">
      <div className="flex flex-col gap-6 md:absolute top-0 left-0 w-full h-full">
        <div className="gap-6 grid md:grid-cols-2">
          <div className="border-primary-01/40 border rounded-xl h-fit border-dashed  bg-white">
            <div className="p-5">
              <div className="text-lg text-black font-black uppercase">Tổng tiền</div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl text-primary-01 mt-4 font-bold "
              >
                {total} cá
              </motion.div>
            </div>
          </div>
          <div className="border-primary-01/40 border rounded-xl h-fit border-dashed  bg-white">
            <div className="p-5">
              <div className="text-lg text-black font-black uppercase">Tổng món</div>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl text-primary-01 mt-4 font-bold"
              >
                {totalOlder} Món
              </motion.div>
            </div>
          </div>
        </div>
        <div className="relative w-full flex-1">
          <div className="border-primary-01/40 border rounded-xl col-span-2 text-left border-dashed  bg-white">
            <div className="p-5">
              <div className="text-lg text-black font-black">LỊCH SỬ 5 MÓN</div>
              <motion.div
                className="flex flex-col gap-1 mt-1 text-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[...history, ...again].map((item, index) => (
                  <motion.div key={index + "history"} variants={itemVariants}>
                    - {item.name || "..........."}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelInfo;
