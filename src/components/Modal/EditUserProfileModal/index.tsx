import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import SpinnerLoad from "../../Load/SpinnerLoad";
import { api } from "../../../providers/Api";
import { useForm } from "react-hook-form";
import { Cross1Icon } from "@radix-ui/react-icons";
import { PersonIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "react-query"
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { z } from "zod";

type GetUserResponse = {
  profile_photo: string;
  username: string;
  email: string;
};

type UploadImageResponse = {
  imageUrl: string;
};

type EditUserProfileModalProps = {
  id: string | undefined | null;
  children: React.ReactNode;
};

export const editUserProfileFormSchema = z.object({
  username: z.string().transform((name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => {
        return word[0].toLocaleUpperCase().concat(word.substring(1));
      })
      .join(" ");
  }),
  email: z.string(),
});

export type editUserProfileFormData = z.infer<typeof editUserProfileFormSchema>;

const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({ id, children }) => {
  const router = useRouter();
  const { 
    reset, 
    register, 
    handleSubmit 
  } = useForm<editUserProfileFormData>({
    resolver: zodResolver(editUserProfileFormSchema),
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [callRequest, setCallRequest] = useState<boolean>(false);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file))
    }  
  };

  const send = (data: editUserProfileFormData) => {
    mutate({
      username: data.username,
      email: data.email,
    });
  };

  const { isLoading } = useQuery({
    queryKey: ["get-user-account-by-id"],
    queryFn: async () => {
      await api.get<GetUserResponse>(`/user/${id}`).then((res) => {
        reset(res.data);
        setFetchedImage(res.data.profile_photo);
      });
    },
    enabled: callRequest,
  });

  const { isLoading: updating, mutate } = useMutation({
    mutationKey: ["update-account-data"],
    mutationFn: async (data: editUserProfileFormData) => {
      if (selectedImage != undefined) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        const upload = await api.post<UploadImageResponse>('uploads/image/', formData);

        await api.patch<GetUserResponse>(`/user/${id}`, {
          ...data,
          profile_photo: upload.data.imageUrl,  
        });
      } else {
        await api.patch<GetUserResponse>(`/user/${id}`, {
          ...data,
        });
      }
    },
    onSuccess: () => {
      if (updating != true) {
        reset();
        setIsOpen(false);
        router.reload();
      }
    },
  });

  useEffect(() => {
    if (isOpen != true) {
      setCallRequest(false);
      setPreviewImage(null);
      setSelectedImage(undefined);
      setPhoto(null);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [isOpen, setCallRequest, reset]);

  useEffect(() => {
    if (fetchedImage) {
      setPhoto(fetchedImage);
    }
    if (previewImage) {
      setPhoto(previewImage);
    }
  }, [photo, setPhoto, fetchedImage, previewImage]);

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <div className="w-12 h-14 flex items-center justify-center">
        <Dialog.Trigger className="w-14 h-14">
          {children}
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-10" />
        <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Editar dados do seu perfil
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center border-none">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          {isLoading && 
            <div className="w-full h-full absolute z-20">
              <div className="w-full h-full bg-[#f9fafb8b]">
                <SpinnerLoad
                  divProps={{
                    className:
                      "w-full h-[488px] relative flex items-center justify-center bg-gray-500-50",
                  }}
                />
              </div>
            </div>
          }
          {updating && 
            <div className="w-full h-full absolute z-20">
              <div className="w-full h-full bg-[#f9fafb8b]">
                <SpinnerLoad
                  divProps={{
                    className:
                      "w-full h-[488px] relative flex items-center justify-center bg-gray-500-50",
                  }}
                />
              </div>
            </div>
          }  
          <div className="w-full px-6 py-6">
            <form
              onSubmit={handleSubmit(send)}
              className="w-full flex flex-col gap-[136px]"
            >
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex items-center gap-4">
                  <div className="w-[72px] h-full flex items-center flex-col gap-2">
                    <div className="w-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-shark-950">
                        Foto
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <Avatar.Root className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden">
                        <Avatar.Image
                          src={photo as string | undefined}
                          className="w-full h-full object-cover"
                        />
                        <Avatar.Fallback className="w-16 h-16 flex items-center justify-center border border-gray-200 rounded-full overflow-hidden" delayMs={600}>
                          <PersonIcon width={20} height={20} color="#e5e7eb" />    
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </div>
                  </div>
                  <div className="w-full h-full flex">
                    <div className="w-full flex justify-center flex-col gap-1">
                      <label
                        htmlFor="user-photo-file"
                        className="w-[156px] text-base font-normal text-[#4573D2] cursor-pointer"
                      >
                        Selecionar uma foto
                      </label>
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        id="user-photo-file"
                        className="hidden"
                        onChange={handleImage}
                      />
                      <div className="w-full">
                        <div className="w-[516px] flex flex-col">
                          <p className="w-16 text-shark-950 font-semibold text-sm">
                            Dica:
                          </p>
                          <p className="w-[500px] text-gray-500 font-normal text-sm whitespace-nowrap">
                            Uma foto de perfil do paciente o ajuda a ser
                            reconhecido na plataforma.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-3">
                      <label htmlFor="username" className="w-full text-sm font-normal text-shark-950">Nome completo</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-shark-950 font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register("username")}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-3">
                      <label htmlFor="email" className="w-full text-sm font-normal text-shark-950">E-mail</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-shark-950 font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register("email")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-shark-950 font-medium bg-white hover:bg-gray-50">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditUserProfileModal;
