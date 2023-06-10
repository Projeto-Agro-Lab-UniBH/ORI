import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { PersonIcon } from "@radix-ui/react-icons";
import { Label } from "../Label/Label";
import { useForm } from "react-hook-form";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query"
import { api } from "../../providers/Api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Load } from "../Load/Load";

const editUserProfileFormSchema = z.object({
  username: z.string().nonempty(),
  email: z.string().nonempty(),
});

type editUserProfileFormData = z.infer<typeof editUserProfileFormSchema>;

type Response = {
  profile_photo: string;
  username: string;
  email: string;
};

type IEditUserProfileModal = {
  id: string | undefined | null;
  children: React.ReactNode;
};

const EditUserProfileModal = (props: IEditUserProfileModal) => {
  const { reset, register, handleSubmit } = useForm<editUserProfileFormData>({
    resolver: zodResolver(editUserProfileFormSchema),
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);

  const { isLoading } = useQuery({
    queryKey: ["get-user-account-by-id"],
    queryFn: async () => {
      await api.get<Response>(`/user/${props.id}`).then((res) => {
        reset(res.data);
        setFetchedImage(res.data.profile_photo);
      });
    },
    enabled: callRequest,
  });

  const queryClient = useQueryClient();

  const { isLoading: savingChanges, mutate } = useMutation({
    mutationKey: ["update-account-data"],
    mutationFn: async (data: editUserProfileFormData) => {
      await api.patch<Response>(`/user/${props.id}`, {
        ...data,
        profile_photo: photo,
      });
    },
  });

  useEffect(() => {
    if (isOpen != true) {
      setCallRequest(false);
      reset();
      setPreviewImage(null);
      setPhoto(null);
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

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const send = async (data: editUserProfileFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <div className="w-12 h-14 flex items-center justify-center">
        <Dialog.Trigger className="w-14 h-14">
          {props.children}
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
          <div id="modal-scroll" className="w-full h-[506px] px-6 py-6">
            {isLoading ? (
              <Load
                divProps={{
                  className:
                    "w-full h-[488px] flex items-center justify-center relative bg-gray-500-50",
                }}
              />
            ) : savingChanges ? (
              <Load
                divProps={{
                  className:
                    "w-full h-[488px] flex items-center justify-center relative bg-gray-500-50",
                }}
              />
            ) : (
              <form
                onSubmit={handleSubmit(send)}
                className="w-full flex flex-col gap-[136px]"
              >
                <div className="w-full flex flex-col gap-6">
                  <div className="w-full flex items-center gap-4">
                    <div className="w-[72px] h-full flex items-center flex-col gap-2">
                      <div className="w-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-brand-standard-black">
                          Foto
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <Avatar.Root
                          className={
                            !photo
                              ? "w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                              : "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                          }
                        >
                          {!photo ? (
                            <div className="w-5 h-5">
                              <PersonIcon
                                className="w-full h-full object-cover"
                                color="#e5e7eb"
                              />
                            </div>
                          ) : (
                            <Avatar.Image
                              className="w-full h-full object-cover"
                              src={photo}
                            />
                          )}
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
                            <p className="w-16 text-brand-standard-black font-semibold text-sm">
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
                        <Label htmlFor="username" text="Nome completo" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                          {...register("username")}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="email" text="E-mail" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                          {...register("email")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-4">
                    <div className="w-[327.2px]">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="password" text="Senha" />
                        <input
                          type="password"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                    Salvar alterações
                  </button>
                </div>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditUserProfileModal;
