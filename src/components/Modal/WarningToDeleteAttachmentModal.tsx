import * as Dialog from '@radix-ui/react-dialog';
import { ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useMutation } from "react-query";
import { api } from '../../providers/Api';
import { queryClient } from '../../providers/QueryClient';

type WarningToDeleteAttachmentModalProps = {
  id: string;
}

const WarningToDeleteAttachmentModal = (props: WarningToDeleteAttachmentModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationKey: ['delete-attachment-by-id'],
    mutationFn: async () => {
      return await api.delete(`/files/${props.id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-file-by-patientId"] });
      if (isLoading != true) {
        setOpen(false);  
      }
    }
  });

  const removeFile = (event: any) => {
    event.preventDefault();
    mutate();
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-[26px] h-[26px] flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer">
        <TrashIcon 
          color="#212529" 
          width={16} 
          height={16} 
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
                onClick={(e) => removeFile(e)} 
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

export default WarningToDeleteAttachmentModal;