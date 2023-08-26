import { useQuery } from "react-query";
import { api } from "../providers/Api";

type FileResponse = {
  id: string;
  patientId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
}

export default function useListPatientFiles(param: { patientId: string; callRequest: boolean; }) {
  return useQuery({
    queryKey: ["get-file-by-patientId"],
    queryFn: async () => {
      const response = await api.get<FileResponse[]>(`/files/${param.patientId}/files`)
      return response.data
    },
    enabled: param.callRequest,
  })
}