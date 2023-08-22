import { api } from "../providers/Api";
import { useQuery } from "react-query";

type ExamResponse = {
  id: string;
  patientId: string;
  date: string;
  author: string;
  type_of_exam: string;
  annotations: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export default function useListPatientExams(param: { patientId: string; callRequest: boolean; }) {
  return useQuery({
    queryKey: ["list-all-exams"],
    queryFn: async () => {
      const response = await api.get<ExamResponse[]>(`/exams/${param.patientId}/exams`)
      return response.data 
    },
    enabled: param.callRequest,
  })
}