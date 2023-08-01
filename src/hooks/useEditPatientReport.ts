import { useMutation, useQueryClient } from "react-query";
import { api } from "../providers/Api";
import { editReportFormData } from "../schemas/editReportFormSchema";

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

export default function useEditPatientReport(param: { patientId: string,  }) {
  const queryClient = useQueryClient();
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