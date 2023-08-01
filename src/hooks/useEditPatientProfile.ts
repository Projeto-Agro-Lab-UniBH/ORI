import { api } from "../providers/Api";
import { Option } from "../interfaces/Option";
import { useMutation, useQueryClient } from "react-query";
import { editPatientProfileFormData } from "../schemas/editPatientProfileFormSchema";

type GetEditedPatientResponse = {
  id: string;
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

export default function useEditPatientProfile(param: {
  id: string;
  photo: string | null;
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-patient"],
    mutationFn: async (data: editPatientProfileFormData) => {
      await api.patch<GetEditedPatientResponse>(`/patient/${param.id}`, {
        ...data,
        profile_photo: param.photo,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}
