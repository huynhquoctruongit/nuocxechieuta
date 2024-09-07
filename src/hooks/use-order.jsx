import { useParams } from 'next/navigation'
import useSWR from "swr";

const useHistory = (limit = 10, page = 1) => {
  const payload = {
    filter: {
      user_created: "$CURRENT_USER",
      status: "published",
    },
    limit: limit,
    page: page,
  };
  const { data, error, isLoading } = useSWR(["/items/order", payload]);
  const history = data?.data || [];
  const lastOrder = history[history.length - 1];
  return { history, isLoading, error, lastOrder };
};

export const useOdersIsNotPaid = () => {
  const { companyId } = useParams();
  const payload = {
    filter: {
      user_created: "$CURRENT_USER",
      is_paid: false,
      company: companyId,
      status: "published",
    },
  };
  const { data, error, isLoading, mutate } = useSWR(["/items/order", payload]);
  const orders = data?.data || [];

  return { orders, isLoading, error, mutate };
};

export default useHistory;
