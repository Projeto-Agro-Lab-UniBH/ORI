import * as Dialog from '@radix-ui/react-dialog';
import { ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { api } from '../../../providers/Api';
import { queryClient } from '../../../providers/QueryClient';

type WarningToDeleteExamModalProps = {
  id: string;
  modalIsOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const WarningToDeleteExamModal: React.FC<WarningToDeleteExamModalProps> = ({ id, modalIsOpen, setLoading }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationKey: ["delete-exam-by-id"],
    mutationFn: async () => {
      await api.delete(`/exams/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-exams"] });
      if (isLoading != true) {
        setOpen(false);
        modalIsOpen(false);
      }
    },
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(isLoading);
    }
  }, [setLoading, isLoading]);

  const acceptRemoveFile = (event: any) => {
    event.preventDefault();
    mutate();
    setOpen(false);
  }
  
  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-10 flex items-center justify-center border border-gray-200 rounded text-base text-brand-standard-black font-medium bg-white hover:border-red-500">
        <TrashIcon
          color="#ef4444" 
          width={20} 
          height={20}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[358px] rounded-lg border border-gray-200 fixed z-20 pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center gap-4 flex-row justify-start">
            <ExclamationTriangleIcon color="#0f172a" width={24} height={24} />
            <Dialog.Title className="font-semibold text-2xl text-slate-900">
              Aviso
            </Dialog.Title>
          </div>
          <div className="w-full flex flex-col justify-center text-center gap-4 px-6 pt-6 pb-6">
            <span>Tem certeza que você quer remover este registro?</span>
            <div className="flex justify-center gap-6">
              <Dialog.Close className="w-[124px] px-3 py-[6px] border rounded font-medium text-base text-slate-900 shadow-md hover:shadow-blue-500/50 hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500">
                Não  
              </Dialog.Close>
              <button
                onClick={(e) => acceptRemoveFile(e)} 
                className="w-[124px] px-3 py-[6px] border rounded font-medium text-base text-slate-900 shadow-md hover:shadow-blue-500/50 hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500"
              >
                Sim
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default WarningToDeleteExamModal;