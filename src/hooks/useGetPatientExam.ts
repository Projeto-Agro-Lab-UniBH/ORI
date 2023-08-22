import { api } from "../providers/Api";
import { useQuery } from "react-query";
import { Dispatch, SetStateAction } from "react";

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

type ExamData = {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export default function useGetPatientExam(param: {
  id: string, 
  reset: any, 
  setData: Dispatch<SetStateAction<ExamData>>,
  callRequest: boolean 
}) {
  return useQuery({
    queryKey: ["get-exam-by-id"],
    queryFn: async () => {
      await api.get<ExamResponse>(`/exams/${param.id}`).then((res) => {
        param.reset(res.data);
        param.setData(res.data);
      });
    },
    enabled: param.callRequest,
  })
}