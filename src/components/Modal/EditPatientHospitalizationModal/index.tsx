import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { z } from "zod"; 
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { api } from "../../../providers/Api";
import { queryClient } from "../../../providers/QueryClient";
import { GetHospitalizationResponse, PatchHospitalizationResponse } from "../../../@types/ApiResponse";

import SpinnerLoad from "../../Shared/Loads/SpinnerLoad";

const editHospitalizationFormSchema = z.object({
  entry_date: z.string().nonempty("Selecione a data do início da internação do paciente."),
  departure_date: z.string(),
  reason: z.string().nonempty("Digite o motivo do paciente estar internado"), 
  prognosis: z.string().nonempty("Digite o prognóstico, mesmo que seja obscuro ou desconhecido"),
  notes: z.string().max(1000, { message: "O texto não pode conter mais do que 1000 caracteres."})
})

type editHospitalizationFormData = z.infer<typeof editHospitalizationFormSchema>

type EditPatientHospitalizationModalProps = {
  id: string;
}

const EditPatientHospitalizationModal: React.FC<EditPatientHospitalizationModalProps> = ({ id }) => {
  const { reset, register, handleSubmit, formState: { errors } } = useForm<editHospitalizationFormData>({
    resolver: zodResolver(editHospitalizationFormSchema),
  });
  
  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useQuery({ 
    queryKey: ["get-hospitalization-by-id"],
    queryFn: async () => {
      setIsLoading(true)
      await api.get<GetHospitalizationResponse>(`/hospitalizations/${id}`).then((res) => {
        reset(res.data);
      });
      setIsLoading(false)
    },
    enabled: callRequest,
  });

  const { isLoading: isUpdating, mutate } = useMutation({
    mutationKey: ["update-patient-hospitalization"],
    mutationFn: async (data: editHospitalizationFormData) => {
      await api.patch<PatchHospitalizationResponse>(`/hospitalizations/${id}`, { ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patient-by-id"] });
      if (isLoading != true) {
        reset();
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [open, setCallRequest, reset]);

  const onSubmit = (data: editHospitalizationFormData) => {
    mutate(data);
  };

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
              Editar internação
            </Dialog.Title>
            <Dialog.Close className="h-8 bg-transparent flex justify-center items-center">
              <Cross1Icon className="text-slate-400 hover:text-slate-500" width={24} height={24} />
            </Dialog.Close>
          </div>
          {loadingSpinner}
          <ScrollArea.Root className="w-full h-[402px] overflow-hidden">
            <ScrollArea.Viewport className="w-full h-full px-6 py-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-10"
              >
                <div className="w-full flex flex-col gap-6">
                  <div className="w-full flex flex-row gap-3">
                    <div className="w-[176px] flex flex-col gap-2">
                      <div className="w-[176px] flex flex-col gap-3">
                        <label
                          htmlFor="entry_date"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Data de entrada
                        </label>
                        <input
                          type="date"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.entry_date
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("entry_date")}
                        />
                      </div>
                      {errors.entry_date && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.entry_date.message}
                        </span>
                      )}     
                    </div>
                    <div className="w-[176px] flex flex-col gap-3">
                      <label
                        htmlFor="departure_date"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Data de saída
                      </label>
                      <input
                        type="date"
                        className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                          errors.departure_date
                            ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        }`}
                        {...register("departure_date")}
                      />
                    </div>  
                  </div>
                  <div className="w-full flex flex-row gap-3">
                    <div className="w-[288px] flex flex-col gap-2">
                      <div className="w-[288px] flex flex-col gap-3">
                        <label
                          htmlFor="reason"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Motivo da internação
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.reason
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("reason")}
                        />
                      </div>
                      {errors.reason && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.reason.message}
                        </span>
                      )} 
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="prognosis"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Prognóstico
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.prognosis
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("prognosis")}
                        />
                      </div>
                      {errors.prognosis && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.prognosis.message}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="notes"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Descrição
                      </label>
                      <textarea
                        rows={14}
                        placeholder="Detalhe com mais informações sobre a internação ou o estado de saúde do paciente"
                        className={`resize-none block w-full rounded-lg border-0 p-[12px] text-sm text-slate-900 ring-1 ring-inset ${
                          errors.notes
                            ? "ring-red-300 placeholder:text-red-400 focus:outline-red-500 focus:ring-1 focus:ring-inset focus:ring-red-500"
                            : "ring-slate-300 placeholder:text-slate-400 focus:outline-slate-500 focus:ring-1 focus:ring-inset focus:ring-slate-500"
                        }`}
                        {...register("notes")}
                      ></textarea>
                    </div>
                    {errors.notes && (
                      <span className="font-normal text-xs text-red-400">
                        {errors.notes.message}
                      </span>
                    )}    
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
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EditPatientHospitalizationModal;