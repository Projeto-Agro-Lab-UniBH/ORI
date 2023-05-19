import * as Avatar from "@radix-ui/react-avatar";     
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Cross1Icon } from "@radix-ui/react-icons";
import { PersonIcon } from "@radix-ui/react-icons";
import { Label } from "../Label/Label";
import { useForm } from "react-hook-form";

export function EditProfileModal() {
  const { register, handleSubmit } = useForm();

  return (
    <Tabs.Root defaultValue="profile">
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
        <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Editar dados do seu perfil
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center border-none">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          <div 
            id="modal-scroll"
            className="w-full h-[506px] px-6 py-6"
          >
            <form className="w-full flex flex-col gap-[136px]">
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex items-center gap-4">
                  <div className="w-[72px] h-full flex items-center flex-col gap-2">
                    <div className="w-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-brand-standard-black">Foto</span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                    <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"></div>
                      {/* <Avatar.Root className="w-16 h-16 border-brand-standard-black border-2 rounded-full flex items-center justify-center overflow-hidden">
                        <PersonIcon width={20} height={20} color="#212529" />
                        <Avatar.Image
                          className="w-full h-full object-cover"
                          src="/photo-person.jpg"
                        />
                      </Avatar.Root> */}
                    </div>
                  </div>
                  <div className="w-full h-full flex">
                    <div className="w-full flex justify-center flex-col gap-1">
                      <label htmlFor="patient-photo-file" className="w-[156px] text-base font-normal text-[#4573D2] cursor-pointer">
                        Selecionar uma foto
                      </label>
                      <input type="file" id="patient-photo-file" name="patientPhotoFile" className="hidden" />
                      <div className="w-full">
                        <div className="w-[516px] flex flex-col">
                          <p className="w-16 text-brand-standard-black font-semibold text-sm">Dica:</p>
                          <p className="w-[500px] text-gray-500 font-normal text-sm whitespace-nowrap">
                            Uma foto de perfil do paciente o ajuda a ser reconhecido na plataforma.
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
                </div>
                <div className="w-full flex flex-row gap-4">
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
              </div>
              <div className="w-full flex justify-end">
                <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Tabs.Root>
  );
}
