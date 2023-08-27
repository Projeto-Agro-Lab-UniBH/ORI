import { api } from "../providers/Api";
import { Option } from "../interfaces/Option";
import { useMutation} from "react-query";
import { queryClient } from "../providers/QueryClient";
import { editPatientProfileFormData } from "../components/Modal/EditPatientProfileModal";

type UploadImageResponse = {
  imageUrl: string;
};

type EditedPatientResponse = {
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
  image: any;
}) {
  return useMutation({
    mutationKey: ["update-patient"],
    mutationFn: async (data: editPatientProfileFormData) => {
      const formData = new FormData();
      formData.append('image', param.image)
      
      if (param.image != null || undefined) {
        const upload = await api.post<UploadImageResponse>('uploads/image/', formData)
        
        await api.patch<EditedPatientResponse>(`/patient/${param.id}`, {
          ...data,
          profile_photo: upload.data.imageUrl,
        });
      } else {
        await api.patch<EditedPatientResponse>(`/patient/${param.id}`, {
          ...data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}
