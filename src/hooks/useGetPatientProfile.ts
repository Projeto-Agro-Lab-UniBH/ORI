import { useQuery } from "react-query";
import { Option } from "../interfaces/Option";
import { api } from "../providers/Api";
import { Dispatch, SetStateAction } from "react";

type GetPatientProfileResponse = {
  profile_photo: string;
  name: string;
  owner: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  entry_date: string;
  departure_date: string;
};

export default function useGetPatientProfile(param: {
  id: string,
  reset: any,
  setValueDiagnosis: Dispatch<SetStateAction<readonly Option[]>>,
  setFetchedImage: Dispatch<SetStateAction<string | null>>,
  callRequest: boolean,
}) {
  return useQuery({
    queryKey: ["get-patient-by-id"],
    queryFn: async () => {
      await api
        .get<GetPatientProfileResponse>(`/patient/${param.id}`)
        .then((res) => {
          if ((res.data as GetPatientProfileResponse).diagnosis.length > 0) {
            param.setValueDiagnosis(
              (res.data as GetPatientProfileResponse).diagnosis
            );
          }
          param.reset(res.data);
          param.setFetchedImage(res.data.profile_photo);
        });
    },
    enabled: param.callRequest,
  });
}
