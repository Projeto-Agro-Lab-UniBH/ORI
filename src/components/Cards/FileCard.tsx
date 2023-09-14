import Image from "next/image";
import * as Dialog from '@radix-ui/react-dialog';
import { useEffect, useState } from "react";
import { Document, Page } from 'react-pdf'; 
import { DownloadIcon, ExclamationTriangleIcon, TrashIcon } from '@radix-ui/react-icons';
import { formatFileSize } from "../../functions/formatBytes";
import { useMutation } from "react-query";
import { queryClient } from "../../providers/QueryClient";
import { api } from "../../providers/Api";

type FileCardProps = {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
};

export const FileCard: React.FC<FileCardProps> = ({ id, filename, fileUrl, fileSize }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    if (fileUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = fileUrl;
      downloadLink.download = filename;
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }, [fileUrl, filename]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const renderDownloadButton = () => {
    if (fileUrl) {
      return (
        <button
          onClick={downloadFile}
          className="w-[26px] h-[26px] flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer"
        >
          <DownloadIcon color="#212529" width={16} height={16} />
        </button>
      );
    }
    return null;
  };

  // A ação de download é tratada no useEffect acima, o método abaixo foi deixado vazio propositalmente
  const downloadFile = () => {};

  return (
    <div className="w-[202.8px] border rounded border-gray-200 overflow-hidden flex flex-col items-center">
      <div className="w-[202.8px] h-[264px] overflow-hidden relative">
        <div className="w-[202.8px] h-[264px] flex px-2 py-2 rounded justify-end absolute z-10">
          <div className="flex flex-col gap-2">
            {renderDownloadButton()}
            <WarningToDeleteAttachmentModal id={id} />
          </div>
        </div>
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={1} width={202.8} />
        </Document>
      </div>
      <div className="w-[202.8px] h-14 border-t-[1px] border-gray-200 flex items-center p-2 gap-1">
        <Image src="/pdf-svgrepo-com.svg" alt="pdf-icon" width={24} height={24} />
        <div className="w-[192px] flex flex-col items-center justify-center">
          <div className="w-[164px] whitespace-nowrap overflow-hidden text-ellipsis">
            <p className="max-w-[164px] whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-[14.8px]">
              {filename.split('.').slice(0, -1).join('.')}
            </p>
          </div>
          <div className="w-[164px] flex flex-row items-center text-center gap-1">
            <span className="text-[10px] font-light">{numPages} páginas</span>
            <span className="text-[10px] font-light">•</span>
            <span className="text-[10px] font-light">{filename.split('.').pop()?.toUpperCase()}</span>
            <span className="text-[10px] font-light">•</span>
            <span className="text-[10px] font-light">{formatFileSize(fileSize)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

type WarningToDeleteAttachmentModalProps = {
  id: string;
}

const WarningToDeleteAttachmentModal: React.FC<WarningToDeleteAttachmentModalProps> = ({ id }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { isLoading, mutate } = useMutation({
    mutationKey: ['delete-attachment-by-id'],
    mutationFn: async () => {
      return await api.delete(`/files/${id}`)
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
          color="#ef4444" 
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