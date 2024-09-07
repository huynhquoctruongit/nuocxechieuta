import { useAuth } from "@/hooks/use-auth";
import { useMediaQuery } from "usehooks-ts";
import useSWR from "swr";
import { motion } from "framer-motion";

const ChartPrice = () => {
  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };
  const variantsBar = (height) => ({
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: height },
  });
  const { profile } = useAuth();
  const isMd = useMediaQuery("(min-width: 768px)");
  const payload = {
    filter: {
      company: { _eq: profile.company },
      status: { _eq: "published" },
      user_created: { _eq: profile.id },
      date_created: { _gte: "$NOW(-35 day)" },
    },
    groupBy: ["week(date_created)"],
    aggregate: { sum: ["price", "delivery_fee"] },
  };
  const { data: report, isLoading } = useSWR(["/items/order", payload]);
  const gap = 50;
  const height = isMd ? 48 : 32;
  const week = [...(report?.data || [])];
  const again = Array.from({ length: 5 - week.length }, (_, i) => ({
    sum: { price: 0, delivery_fee: 0 },
    date_created_week: null,
  }));

  const listPrice = Array.from({ length: 7 }, (_, i) => gap * i).reverse();

  return (
    <div className="text-left">
      {week.length > 0 && !isLoading && (
        <div className="rounded-xl w-full p-3 md:p-6 flex border border-primary-01/40 ring-[6px] bg-white ring-primary-01/5 ring-offset-0">
          <div>
            <motion.div
              className=""
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {listPrice.map((price, index) => (
                <motion.div
                  key={price + "price" + index}
                  className="h-10 flex items-end border-dashed border-b"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  {price}
                </motion.div>
              ))}
            </motion.div>
            <div className="flex items-center ">
              <div className="w-12 md:w-20 relative"></div>
              <div className="items-center gap-4 md:gap-10 flex">
                {[...again, ...week].map((item, index) => {
                  const value = parseInt(item.sum.price) + (parseInt(item.sum.delivery_fee) || 0);
                  const label = item.date_created_week === null ? null : `T.${item.date_created_week}`;
                  const heightStyle = Math.ceil((value * height) / gap);
                  return (
                    <div className=" relative w-10 cursor-pointer" key={"prices" + index}>
                      <div className="font-bold text-gray-400 pt-2 text-center text-sm">{label}</div>
                      <motion.div
                        variants={variantsBar(heightStyle)}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, type: "spring" }}
                        className="absolute bottom-full left-0 w-10 hover:bg-primary-01 bg-pastel-pink duration-200 rounded-t-sm"
                        // style={{ height: Math.ceil((value * height) / gap) }}
                      >
                        {value > 0 && (
                          <motion.div
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.3, delay: 0.6 }}
                            className="absolute bottom-full left-0 w-10 text-xs text-center rounded-t-sm mb-2"
                          >
                            {value}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {week.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 border flex items-center justify-center border-primary-01/40 ring-[6px] bg-white ring-primary-01/5 ring-offset-0 min-h-[360px] rounded-md md:min-w-[350px]">
          <div className="flex items-center justify-center flex-col">
            <img src="/images/not-found.png" className="w-20 h-20" />
            <div className="text-gray-400">Không có dữ liệu</div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="text-center text-gray-400 border flex items-center justify-center border-primary-01/40 ring-[6px] bg-white ring-primary-01/5 ring-offset-0 min-h-[360px] rounded-md md:min-w-[490px] w-[490px]">
          <div className="flex items-center justify-center flex-col"></div>
        </div>
      )}
    </div>
  );
};

export default ChartPrice;
