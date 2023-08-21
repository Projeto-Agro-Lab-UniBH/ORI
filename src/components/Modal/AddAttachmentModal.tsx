import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, TrashIcon, UploadIcon } from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { api } from "../../providers/Api";
import { useMutation } from "react-query";
import { Load } from "../Load/Load";
import { Document, Page } from "react-pdf";
import { formatFileSize } from "../../functions/formatBytes";
import { queryClient } from "../../providers/QueryClient";

type AddAttachmentModalProps = {
  patientId: string | null;
};

type UploadFileResponse = {
  fileUrl: string;
};

type MutationFileResponse = {
  id: string;
  patientId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
};

const AddAttachmentModal = (props: AddAttachmentModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<any | undefined>();
  const [filename, setFilename] = useState<string>("");
  const [numPages, setNumPages] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (open != true) {
      setAttachedFile(undefined);
      setFilename("");
    }
  }, [open, setAttachedFile, setFilename]);

  const { isLoading, mutate } = useMutation({
    mutationKey: ["add-attachment"],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("file", attachedFile);

      if (attachedFile != undefined) {
        const upload = await api.post<UploadFileResponse>(
          "uploads/file/",
          formData
        );

        await api.post<MutationFileResponse>("/files", {
          patientId: props.patientId,
          filename: filename,
          fileUrl: upload.data.fileUrl,
          fileSize: attachedFile.fileSize,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-file-by-patientId"] });
      if (isLoading != true) {
        setAttachedFile(undefined);
        setOpen(false);
      }
    },
  });

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setAttachedFile(file);
      setFilename(String(file.name));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const removeAttachment = () => {
    setAttachedFile(undefined);
    setFilename("");
  };

  const send = (event: any) => {
    event.preventDefault();
    mutate();
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-[202.8px] border border-gray-200 flex items-center px-3 py-[6px] gap-1 rounded text-base text-brand-standard-black font-medium bg-white hover:border-[#b3b3b3] cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#212529"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
          />
        </svg>
        Adicionar um anexo
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Anexar documento
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          {isLoading && (
            <div className="w-full h-full absolute z-20">
              <div className="w-full h-full bg-[#f9fafb8b]">
                <Load
                  divProps={{
                    className:
                      "w-full h-[488px] relative flex items-center justify-center bg-gray-500-50",
                  }}
                />
              </div>
            </div>
          )}
          <div className="w-full px-6 py-6">
            <div className="w-full flex flex-col h-360 gap-6">
              <div className="w-full flex flex-col gap-3">
                <div className="max-w-xl">
                  <label className="flex justify-center w-full h-24 px-4 transition bg-white border border-gray-200 border-dashed rounded-md appearance-none cursor-pointer hover:border-[#b3b3b3] focus:outline-none">
                    <span className="flex items-center space-x-2">
                      <UploadIcon width={20} height={20} />
                      <span className="font-medium text-gray-600">
                        Pegue e arraste o arquivo para anexar aqui
                      </span>
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      id="patient-photo-file"
                      className="hidden"
                      onChange={handleFile}
                    />
                  </label>
                </div>
              </div>
              {attachedFile && (
                <div className="w-[552.8px] border rounded border-gray-200 overflow-hidden flex flex-col items-center">
                  <div className="w-[552.8px] h-44 overflow-hidden">
                    <Document
                      file={attachedFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={1} width={552.8} />
                    </Document>
                  </div>
                  <div className="w-[552.8px] h-14 border-t-[1px] border-gray-200 flex items-center p-2 gap-2">
                    <Image
                      src="/pdf-svgrepo-com.svg"
                      alt="pdf-icon"
                      width={24}
                      height={24}
                    />
                    <div className="w-80 flex flex-col items-center justify-center">
                      <div className="w-80 whitespace-nowrap overflow-hidden text-ellipsis">
                        <p className="max-w-80 whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-[14.8px]">
                          {filename.split(".").slice(0, -1).join(".")}
                        </p>
                      </div>
                      <div className="w-80 flex flex-row items-center text-center gap-1">
                        <span className="text-[10px] font-light">
                          {numPages} páginas
                        </span>
                        <span className="text-[10px] font-light">•</span>
                        <span className="text-[10px] font-light">
                          {filename.split(".").pop()?.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-light">•</span>
                        <span className="text-[10px] font-light">
                          {formatFileSize(attachedFile.size)}
                        </span>
                      </div>
                    </div>
                    <div className="w-[176.8px] flex justify-end">
                      <button
                        onClick={removeAttachment}
                        className="w-7 h-7 flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer"
                      >
                        <TrashIcon color="#212529" width={16} height={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full flex flex-col gap-3">
                <div className="w-full flex justify-end">
                  <button
                    onClick={(e) => send(e)}
                    className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddAttachmentModal;
