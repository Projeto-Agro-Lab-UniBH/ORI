import { useMutation } from "react-query";
import { api } from "../providers/Api";
import { editReportFormData } from "../schemas/editReportFormSchema";
import { queryClient } from "../providers/QueryClient";

type ReportResponse = {
  id: string;
  patientId: string;
  shift: string;
  author: string;
  title: string;
  report_text: string;
  filename: string;
  fileUrl: string;
  fileSize: number; 
  createdAt: string;
  updatedAt: string;
};

export default function useEditPatientReport(param: { patientId: string,  }) {
  return useMutation({
    mutationKey: ["update-patient"],
    mutationFn: async (data: editReportFormData) => {
      await api.patch<ReportResponse>(`/reports/${param.patientId}`, {
        ...data,
        patientId: param.patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-reports"] });
    },
  });
}