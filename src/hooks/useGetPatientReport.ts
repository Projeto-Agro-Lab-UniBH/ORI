import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";

type ReportResponse = {
  id: string;
	patientId: string;
	shift: string;
	author: string;
	title: string;
	report_text: string;
	filename: string;
	attachment: string;
	createdAt: string;
	updatedAt: string;
};

type ReportData = {
  id: string;
  filename: string;
	attachment: string;
  createdAt: string;
  updatedAt: string;
};

export default function useGetPatientReport(param: { 
  id: string, 
  reset: any, 
  setData: Dispatch<SetStateAction<ReportData>>,
  callRequest: boolean 
}) {
  return useQuery({
    queryKey: ["get-report-by-id"],
    queryFn: async () => {
      await api.get<ReportResponse>(`/reports/${param.id}`).then((res) => {
        param.reset(res.data);
        param.setData(res.data);
      });
    },
    enabled: param.callRequest,
  });
}