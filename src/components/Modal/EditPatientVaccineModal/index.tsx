import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";

import { GetVaccineResponse, PatchVaccineResponse } from "../../../@types/ApiResponse";
import { api } from "../../../providers/Api";
import { queryClient } from "../../../providers/QueryClient";
import SpinnerLoad from "../../Load/SpinnerLoad";

const editVaccineFormSchema = z.object({
  vaccine: z.string().nonempty("Vacina não pode ser branco."),
  date_of_vaccination: z.string().nonempty("Selecione a data de vacinação."),
  revaccination_date: z.string(),
  vaccine_code: z.string(),
  name_of_veterinarian: z.string().nonempty("Nome do médico veterinário não pode ser branco."),
  age: z.string()
})

type editVaccineFormData = z.infer<typeof editVaccineFormSchema>

type EditPatientVaccineModalProps = {
  id: string;
}

const EditPatientVaccineModal: React.FC<EditPatientVaccineModalProps> = ({ id: vaccineId }) => {
  const { reset, register, handleSubmit, formState: { errors } } = useForm<editVaccineFormData>({
    resolver: zodResolver(editVaccineFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useQuery({ 
    queryKey: ["get-vaccine-by-id"],
    queryFn: async () => {
      setIsLoading(true)
      await api.get<GetVaccineResponse>(`/vaccine/${vaccineId}`).then((res) => {
        reset(res.data);
      });
      setIsLoading(false)
    },
    enabled: callRequest,
  });

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [open, setCallRequest, reset]);

  const { isLoading: isUpdating, mutate } = useMutation({
    mutationKey: ["update-patient-vaccine"],
    mutationFn: async (data: editVaccineFormData) => {
      await api.patch<PatchVaccineResponse>(`/vaccine/${vaccineId}`, { ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patient-by-id"] });
      if (isLoading != true) {
        reset();
        setOpen(false);
      }
    },
  });

  const loadingSpinner = (isLoading || isUpdating) && (
    <div className="w-full h-full absolute z-20">
      <div className="w-full h-full bg-[#f9fafb8b]">
        <SpinnerLoad
          divProps={{
            className:
              "w-full h-[402px] relative flex items-center justify-center bg-slate-500-50",
          }}
        />
      </div>
    </div>
  );

  const onSubmit = (data: editVaccineFormData) => {
    mutate(data);
  };
  
  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-full p-1 flex items-center text-center justify-center text-[12px] leading-none text-slate-700 font-normal hover:font-semibold hover:text-[14px]">
        Editar  
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border-none bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-slate-300 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl text-slate-700">
              Editar vacinação
            </Dialog.Title>
            <Dialog.Close className="h-8 bg-transparent flex justify-center items-center">
              <Cross1Icon
                className="text-slate-400 hover:text-slate-500"
                width={24}
                height={24}
              />
            </Dialog.Close>
          </div>
          {loadingSpinner}
          <div className="w-full h-[402px] px-6 py-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full h-full flex flex-col gap-10"
            >
              <div className="w-full h-full flex flex-col gap-6">
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex flex-col gap-3">
                    <label
                      htmlFor="vaccine"
                      className="w-full font-medium text-sm text-slate-700"
                    >
                      Vacina
                    </label>
                    <input
                      type="text"
                      className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                        errors.vaccine
                          ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                      }`}
                      {...register("vaccine")}
                    />
                  </div>
                  {errors.vaccine && (
                    <span className="font-normal text-xs text-red-400">
                      {errors.vaccine.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-row gap-3">
                  <div className="w-[176px] flex flex-col gap-2">
                    <div className="w-[176px] flex flex-col gap-3">
                      <label
                        htmlFor="date_of_vaccination"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Data de vacinação
                      </label>
                      <input
                        type="date"
                        className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                          errors.date_of_vaccination
                            ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        }`}
                        {...register("date_of_vaccination")}
                      />
                    </div>
                    {errors.date_of_vaccination && (
                      <span className="font-normal text-xs text-red-400">
                        {errors.date_of_vaccination.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[176px] flex flex-col gap-3">
                    <label
                      htmlFor="revaccination_date"
                      className="w-full font-medium text-sm text-slate-700"
                    >
                      Data de revacinação
                    </label>
                    <input
                      type="date"
                      className={`w-[176px] block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500`}
                      {...register("revaccination_date")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <label
                      htmlFor="age"
                      className="w-full font-medium text-sm text-slate-700"
                    >
                      Idade do vacinado
                    </label>
                    <input
                      type="text"
                      className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500`}
                      {...register("age")}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-row gap-3">
                  <div className="w-[364px] flex flex-col gap-2">
                    <div className="w-[364px] flex flex-col gap-3">
                      <label
                        htmlFor="name_of_veterinarian"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Nome do médico veterinário
                      </label>
                      <input
                        type="text"
                        className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                          errors.name_of_veterinarian
                            ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        }`}
                        {...register("name_of_veterinarian")}
                      />
                    </div>
                    {errors.name_of_veterinarian && (
                      <span className="font-normal text-xs text-red-400">
                        {errors.name_of_veterinarian.message}
                      </span>
                    )}
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <label
                      htmlFor="vaccine_code"
                      className="w-full font-medium text-sm text-slate-700"
                    >
                      Código da vacina
                    </label>
                    <input
                      type="text"
                      className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500`}
                      {...register("vaccine_code")}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-10 flex justify-end">
                <button
                  type="submit"
                  className="w-[152px] h-10 border border-slate-300 rounded-lg font-medium text-base text-slate-700 bg-white hover:border-none hover:text-white hover:bg-blue-500"
                >
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditPatientVaccineModal;