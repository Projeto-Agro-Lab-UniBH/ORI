import { useQuery } from "react-query";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";

type PatientCardResponse = {
  id: string;
  profile_photo: string;
  name: string;
  specie: string;
  race: string;
};

export default function useSearch({
  searchInputValue,
  setIsLoadingFindedData,
}: {
  searchInputValue: string;
  setIsLoadingFindedData: Dispatch<SetStateAction<boolean>>;
}) {
  return useQuery<PatientCardResponse[]>(
    ["searchValue", searchInputValue],
    async () => {
      setIsLoadingFindedData(true);
      const response = await api.get<PatientCardResponse[]>(
        `/patient/search/by/${searchInputValue}`
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
