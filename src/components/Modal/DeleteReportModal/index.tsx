import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { api } from "../../../providers/Api";
import { queryClient } from "../../../providers/QueryClient";

import styles from "./styles.module.css";

type DeleteReportModalProps = {
  id: string;
};

const DeleteReportModal: React.FC<DeleteReportModalProps> = ({ id: reportId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate } = useMutation({
    mutationKey: ["delete-report-by-id"],
    mutationFn: async () => {
      try {
        setIsLoading(true)
        await api.delete(`/reports/${reportId}`);
      } catch (error) {
        setIsLoading(false)
        console.error("Erro ao excluir relatório:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patient-by-id"] });
      setOpen(false)
      setIsLoading(false)
    },
  });

  const acceptedDeleteReport = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mutate()
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="w-full p-1 flex items-center text-center justify-center text-[12px] leading-none text-slate-700 font-normal hover:font-semibold hover:text-[14px]">
        Excluir
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <AlertDialog.Content className="w-[360px] rounded-lg fixed z-20 pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
          <div className="w-full px-6 pb-4 border-b-[1px] border-slate-300 flex items-center gap-4 flex-row justify-start">
            <ExclamationTriangleIcon color="#0f172a" width={24} height={24} />
            <AlertDialog.Title className="font-semibold text-2xl text-slate-900">
              Aviso
            </AlertDialog.Title>
          </div>
          <div className="w-full flex flex-col justify-center text-center gap-4 px-6 py-6">
            <AlertDialog.Description className="font-normal text-sm text-slate-700">
              Tem certeza que você quer remover este relatório?
            </AlertDialog.Description>
            <div className="flex justify-center gap-6">
              <AlertDialog.Cancel asChild>
                <button className="w-[124px] h-10 border rounded-lg font-medium text-base text-slate-900 shadow-md hover:shadow-blue-500/50 hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500">
                  Não
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <button onClick={acceptedDeleteReport} className="w-[124px] h-10 flex justify-center items-center border rounded-lg font-medium text-base text-slate-900 shadow-md hover:shadow-blue-500/50 hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500">
                  {isLoading ? <div className={styles.spinner}></div> : "Sim" } 
                </button>
              </AlertDialog.Action>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default DeleteReportModal;