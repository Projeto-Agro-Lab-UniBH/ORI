import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import { SearchPatientResponse } from "../@types/ApiResponse";

export default function useSearch({
  router,
  searchInputValue,
  setIsLoading,
}: {
  router: NextRouter;
  searchInputValue: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  return useQuery<SearchPatientResponse[]>(
    ["searchValue", searchInputValue],
    async () => {
      const { prognosis, physical_shape, gender } = router.query;
      setIsLoading(true);
      const response = await api.get<SearchPatientResponse[]>(
        `/patient/search/by/values?prognosis=${
          prognosis || ""
        }&physical_shape=${physical_shape || ""}&gender=${
          gender || ""
        }&search=${searchInputValue || ""}`
      );
      setIsLoading(false);
      return response.data;
    },
    {
      enabled: searchInputValue !== "", // Ativa a busca assim que algo for digitado
      refetchOnReconnect: false,
    }
  );
}
