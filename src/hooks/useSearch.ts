import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";

type PatientCardResponse = {
  id: string;
  profile_photo: string;
  name: string;
  specie: string;
  race: string;
};

export default function useSearch({
  router,
  searchInputValue,
  setIsLoadingFindedData,
}: {
  router: NextRouter;
  searchInputValue: string;
  setIsLoadingFindedData: Dispatch<SetStateAction<boolean>>;
}) {
  return useQuery<PatientCardResponse[]>(
    ["searchForInput", searchInputValue],
    async () => {
      const { prognosis, physical_shape, gender } = router.query;
      setIsLoadingFindedData(true);
      const response = await api.get<PatientCardResponse[]>(
        `/patient/search/by/values?prognosis=${
          prognosis || ""
        }&physical_shape=${physical_shape || ""}&gender=${
          gender || ""
        }&search=${searchInputValue || ""}`
      );
      setIsLoadingFindedData(false);
      return response.data;
    },
    {
      enabled: searchInputValue !== "", // Ativa a busca assim que algo for digitado
      refetchOnReconnect: false,
    }
  );
}
