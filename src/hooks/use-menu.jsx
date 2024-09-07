import dayjs from "dayjs";
import { useParams } from 'next/navigation'
import useSWR from "swr";

export const useMenuToday = () => {
  const today = dayjs().startOf("day").toISOString();
  const { providerId } = useParams();
  const payload = {
    filter: {
      date_created: { _gte: today },
      status: "published",
      bulk_food_provider: providerId,
    },
    limit: 1,
    sort: "date_created",
    fields: "*,user_created.*,bulk_food_provider.*",
  };
  const { data, mutate, isLoading } = useSWR([`/items/menu`, payload]);
  const { data: dataProvider } = useSWR(`/items/bulk_food_provider/${providerId}`);

  const menu = data?.data[0] || {};
  return { menu, mutate, isLoading, provider: dataProvider?.data };
};

export default useMenuToday;
