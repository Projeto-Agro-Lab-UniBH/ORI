import SpinnerLoad from "../../Load/SpinnerLoad";
import { api } from "../../../providers/Api";
import { z } from "zod";
import { queryClient } from "../../../providers/QueryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { GetReportResponse, PatchReportResponse } from "../../../@types/ApiResponse";
import { format } from "date-fns";
import * as locale from 'date-fns/locale';

import styles from "./styles.module.css";

type EditPatientReportModalProps = {
  id: string;
}

const editReportFormSchema = z.object({
  title: z.string().nonempty("O relatório precisa ter um título."),
  text: z.string().max(1000, { message: "O texto do relatório não pode conter mais do que 1000 caracteres." }).nonempty("O relatório precisa ter um texto."),
});

type editReportFormData = z.infer<typeof editReportFormSchema>;

const EditPatientReportModal = ({ id: reportId }: EditPatientReportModalProps) => {
  const { reset, register, handleSubmit, formState: { errors } } = useForm<editReportFormData>({
    resolver: zodResolver(editReportFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useQuery({ 
    queryKey: ["get-report-by-id"],
    queryFn: async () => {
      setIsLoading(true)
      await api.get<GetReportResponse>(`/reports/${reportId}`).then((res) => {
        reset(res.data);
      });
      setIsLoading(false)
    },
    enabled: callRequest,
  });

  const { isLoading: isUpdating, mutate } = useMutation({
    mutationKey: ["update-patient-report"],
    mutationFn: async (data: editReportFormData) => {
      await api.patch<PatchReportResponse>(`/reports/${reportId}`, { ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patient-by-id"] });
      if (isUpdating != true) {
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

  const onSubmit = (data: editReportFormData) => {
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
  
  // const formattedCreatedAt = data.createdAt ? format(new Date(data.createdAt), 'dd MMMM yyyy', { locale: locale.ptBR }) : '';
  // const formattedTimeItCreated = data.createdAt ? format(new Date(data.createdAt), 'HH:mm', { locale: locale.ptBR }) : '';
  // const formattedUpdatedAt = data.updatedAt ? format(new Date(data.updatedAt), 'dd MMMM yyyy', { locale: locale.ptBR }) : '';
  // const formattedTimeItUpdated = data.updatedAt ? format(new Date(data.updatedAt), 'HH:mm', { locale: locale.ptBR }) : '';

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
              Editar relatório
            </Dialog.Title>
            <Dialog.Close className="h-8 bg-transparent flex justify-center items-center">
              <Cross1Icon className="text-slate-400 hover:text-slate-500" width={24} height={24} />
            </Dialog.Close>
          </div>
          {loadingSpinner}
          <div 
            id={styles.modalScroll}
            className="w-full h-[402px] px-6 py-6 overflow-y-scroll"
          >
            <div className="w-full flex flex-col gap-6">
              {/* <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="font-normal text-xs text-slate-500">Usuário que realizou a postagem</span>      
                  <span className="font-medium text-base text-slate-700">{data.username}</span>  
                </div>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-slate-500">Data de criação</span>      
                    <span className="font-medium text-base text-slate-700">{formattedCreatedAt}</span>  
                  </div>
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-slate-500">Hora da postagem</span>      
                    <span className="font-medium text-base text-slate-700">{formattedTimeItCreated}</span>  
                  </div>
                </div>
                {data.updatedAt && (
                  <div className="flex flex-row gap-6">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-slate-500">Data da ultima edição</span>      
                    <span className="font-medium text-base text-slate-700">{formattedUpdatedAt}</span>  
                  </div>
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-slate-500">Hora da postagem editada</span>      
                    <span className="font-medium text-base text-slate-700">{formattedTimeItUpdated}</span>  
                  </div>
                </div>
                )}
              </div>   */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col h-360 gap-6"
              >
                <div className="w-full flex flex-col gap-6">
                  <div className="w-full flex flex-row gap-3">
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="title"
                          className="w-full font-medium text-sm text-slate-900"
                        >
                          Título
                        </label>
                        <input
                          type="text"
                          className={`w-full block p-2.5 font-normal text-sm text-slate-900 bg-white rounded-lg border ${
                            errors.title
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("title")}
                        />
                      </div>
                      {errors.title && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.title.message}
                        </span>
                      )}
                    </div> 
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="text"
                        className="w-full font-medium text-sm text-slate-900 "
                      >
                        Relatório
                      </label>
                      <textarea 
                        id={styles.textareaScroll}
                        rows={12} 
                        placeholder="Digite o seu relatório"
                        className={`resize-none block w-full rounded-lg border-0 p-[12px] text-sm text-slate-900 ring-1 ring-inset ${
                          errors.text
                            ? "ring-red-300 placeholder:text-red-400 focus:outline-red-500 focus:ring-1 focus:ring-inset focus:ring-red-500"
                            : "ring-slate-300 placeholder:text-slate-400 focus:outline-slate-500 focus:ring-1 focus:ring-inset focus:ring-slate-500"
                        }`}
                        {...register("text")}
                      ></textarea>
                    </div>
                    {errors.text && (
                      <span className="font-normal text-xs text-red-400">
                        {errors.text.message}
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
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditPatientReportModal;