"use client"
import { useAuth } from "@/hooks/use-auth";
import ReportByAdmin from "./report-by-admin";
import ReportByUser from "@/modules/report/screen/user";
const Report = () => {
  const { profile, isLoading } = useAuth();
  const isAdmin = profile?.permission_to_update_order;
  if (isLoading) return null;
  return isAdmin ? <ReportByAdmin /> : <ReportByUser />;
};
export default Report;
