import { useQuery } from "react-query";
import { api } from "../providers/Api";

type ListPatientReportsResponse = {
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

export default function useListPatientReports(param: {
  patientId: string
	callRequest: boolean
}) {
  return useQuery({
		queryKey: ['list-all-reports'],
		queryFn: async () => {
			const response = await api.get<ListPatientReportsResponse[]>(`/reports/${param.patientId}/reports`);
			return response.data;
		},
		enabled: param.callRequest,
	});
}