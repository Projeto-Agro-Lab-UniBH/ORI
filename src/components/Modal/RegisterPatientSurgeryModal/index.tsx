import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { api } from "../../../providers/Api";
import { queryClient } from "../../../providers/QueryClient";
import { useAuthContext } from "../../../contexts/AuthContext";
import { PostSurgeryResponse } from "../../../@types/ApiResponse";

import SpinnerLoad from "../../Shared/Loads/SpinnerLoad";

const registerSurgeryFormSchema = z.object({
  execution_date: z.string().nonempty("Selecione a data de realização da cirurgia."),
  duration: z.string().nonempty("Digite o tempo de duração da cirurgia."),
  period: z.string().nonempty("O período em que foi feito a cirurgia não pode ser branco."),
  name_of_surgery: z.string().nonempty("O nome da cirurgia não pode ser branco."),
  risk_level: z.string().nonempty("O nível de risco da cirurgia não pode ser branco."),
  notes: z.string().max(1000, { message: "O texto não pode conter mais do que 1000 caracteres."})
})

type registerSurgeryFormData = z.infer<typeof registerSurgeryFormSchema>

type RegisterPatientSurgeryModalProps = {
  patientId: string;
}

const RegisterPatientSurgeryModal: React.FC<RegisterPatientSurgeryModalProps> = ({ patientId }) => {
  const { reset, register, handleSubmit, formState: { errors } } = useForm<registerSurgeryFormData>({
    resolver: zodResolver(registerSurgeryFormSchema),
  });
  const { user } = useAuthContext();
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationKey: ["create-surgery"],
    mutationFn: async (data: registerSurgeryFormData) => {
      await api.post<PostSurgeryResponse>("/surgery", {
        ...data,
        patientId: patientId,
        username: user?.username,
      });
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
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: registerSurgeryFormData) => {
    mutate(data);
  };

  const loadingSpinner = isLoading && (
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
      <Dialog.Trigger className="w-[148px] h-10 border border-gray-300 rounded-lg font-medium text-base text-slate-900 bg-white hover:border-none hover:text-neutral-50 hover:bg-blue-500">
        Registrar cirurgia
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border-none bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-slate-300 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl text-slate-700">
              Registrar cirurgia
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
                          htmlFor="execution_date"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Data da operação
                        </label>
                        <input
                          type="date"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.execution_date
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("execution_date")}
                        />
                      </div>
                      {errors.execution_date && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.execution_date.message}
                        </span>
                      )}     
                    </div>
                    <div className="w-[176px] flex flex-col gap-2">
                      <div className="w-[176px] flex flex-col gap-3">
                        <label
                          htmlFor="duration"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Duração da cirurgia
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.duration
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("duration")}
                        />
                      </div>
                      {errors.duration && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.duration.message}
                        </span>
                      )}     
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="period"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Período
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.period
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("period")}
                        />
                      </div>
                      {errors.period && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.period.message}
                        </span>
                      )}     
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-3">
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="name_of_surgery"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Nome da cirurgia / Procedimento
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.name_of_surgery
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("name_of_surgery")}
                        />
                      </div>
                      {errors.name_of_surgery && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.name_of_surgery.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex flex-row gap-3">
                    <div className="w-[244px] flex flex-col gap-2">
                      <div className="w-[244px] flex flex-col gap-3">
                        <label
                          htmlFor="risk_level"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Nível de risco da operação
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                            errors.risk_level
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("risk_level")}
                        />
                      </div>
                      {errors.risk_level && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.risk_level.message}
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
                        placeholder="Descreva a cirurgia"
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
                    className="w-[148px] h-10 border border-slate-300 rounded-lg font-medium text-base text-slate-700 bg-white hover:border-none hover:text-white hover:bg-blue-500"
                  >
                    Registrar cirurgia
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

export default RegisterPatientSurgeryModal;