import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";

type ReportResponse = {
  id: string;
  patientId: string;
  shift: string;
  author: string;
  report_text: string;
  createdAt: string;
  updatedAt: string;
  attachments: string;
};

type ReportData = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export default function useGetPatientReport(param: { 
  id: string, 
  reset: any, 
  setData: Dispatch<SetStateAction<ReportData>>, 
  setFecthedAttachment: Dispatch<SetStateAction<string | undefined>>, 
  callRequest: boolean 
}) {
  return useQuery({
    queryKey: ["get-report-by-id"],
    queryFn: async () => {
      await api.get<ReportResponse>(`/reports/${param.id}`).then((res) => {
        param.reset(res.data);
        param.setData(res.data);
				param.setFecthedAttachment(res.data.attachments)
      });
    },
    enabled: param.callRequest,
  });
}