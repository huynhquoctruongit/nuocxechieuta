import dayjs from "dayjs";
import { useParams } from "next/navigation";
import useSWR from "swr";

const useOrder = () => {
  const { providerId, companyId } = useParams();
  const today = dayjs().startOf("day").toISOString();
  const payload = {
    filter: {
      date_created: {
        _gte: today,
      },
      status: "published",
      bulk_food_provider: providerId,
      company: companyId,
    },
    sort: "date_created",
    fields: "*,user_created.*",
  };
  const { data, mutate, isLoading } = useSWR([`/items/order`, payload]);
  const orders = data?.data || [];

  return { orders, mutate, isLoading };
};

export default useOrder;
