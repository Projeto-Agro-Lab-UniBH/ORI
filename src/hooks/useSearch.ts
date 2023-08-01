import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Page } from "../@types/page";
import { Option } from "../interfaces/Option";
import { NextRouter } from "next/router";

type PatientCardResponse = {
  id: string;
  profile_photo?: string;
  name: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
};

export default function useSearch(param: {currentPage: number, router: NextRouter}) {
  return useQuery({
    queryKey: ["search", param.currentPage],
    queryFn: async () => {
      const response = await api.get<Page<PatientCardResponse>>(
        `/patient/search/filters?page=${param.currentPage}&prognosis=${!param.router.query.prognosis ? '' : param.router.query.prognosis}&physical_shape=${!param.router.query.physical_shape ? '' : param.router.query.physical_shape}&gender=${!param.router.query.gender ? '' : param.router.query.gender}`
      );
      return response.data;
    },
    enabled: true,
    refetchOnReconnect: false
  });
}