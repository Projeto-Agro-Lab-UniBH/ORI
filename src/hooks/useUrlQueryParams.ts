import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Page } from "../@types/page";
import { Option } from "../interfaces/Option";
import { NextRouter } from "next/router";
import { Exams } from "../@types/exams";

type PatientCardResponse = {
  id: string;
  profile_photo: string;
  name: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  exams: Exams[];
};

export default function useUrlQueryParams({ currentPage, router }: { currentPage: number; router: NextRouter }) {
  return useQuery<Page<PatientCardResponse>, Error>({
    queryKey: ["search", currentPage],
    queryFn: async () => {
      const { prognosis, physical_shape, gender, search } = router.query;
      const response = await api.get<Page<PatientCardResponse>>(
        `/patient/search/filters?page=${currentPage}&prognosis=${prognosis || ''}&physical_shape=${physical_shape || ''}&gender=${gender || ''}&search=${search || ''}`
      );
      return response.data;
    },
    enabled: true,
    refetchOnReconnect: false
  });
}
