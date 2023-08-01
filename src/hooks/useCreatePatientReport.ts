import { useMutation, useQueryClient } from "react-query";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";
import { registerReportFormData } from "../schemas/registerReportFormSchema";

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

export default function useCreatePatientReport(param: { 
  patientId: string | null,
  attachedFile: string | undefined,
  reset: any,
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create-report"],
    mutationFn: async (data: registerReportFormData) => {
      await api.post<ReportResponse>("/reports", {
        ...data,
        patientId: param.patientId,
        attachments: param.attachedFile
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-reports"] });
      param.reset();
      param.setOpen(false);
    },
  });
}