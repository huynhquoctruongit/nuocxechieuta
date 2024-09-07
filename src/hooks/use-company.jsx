import useSWR from "swr";
import { useAuth } from "./use-auth";
import { useParams } from 'next/navigation'

const useCompanyManager = () => {
  const { profile } = useAuth();
  const payload = {
    filter: {
      admin: profile.id,
    },
    limit: 1,
  };
  const { data, error, isLoading } = useSWR(["/items/company", payload]);
  const company = data?.data?.[0];
  return { company, isLoading, error };
};

export const useCompany = () => {
  const { companyId } = useParams();
  const payload = {
    fields: ["*", "admin.id", "admin.last_name", "admin.first_name", "admin.qr_code_for_payment", "admin.email"],
  };
  const { data, error, isLoading, mutate } = useSWR(["/items/company/" + companyId, payload]);
  const company = data?.data;
  return { company, isLoading, error, mutate };
};

export const useUserInCompany = () => {
  const { companyId } = useParams();
  const { data, error, isLoading } = useSWR("/users?filter[company][_eq]=" + companyId);
  const users = data?.data || [];
  return { users, isLoading, error };
};

export default useCompanyManager;
