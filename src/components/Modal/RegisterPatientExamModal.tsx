import Image from "next/image";
import Load from "../Load/Load";
import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { formatFileSize } from "../../functions/formatBytes";
import { queryClient } from "../../providers/QueryClient";
import { useMutation } from "react-query";
import { api } from "../../providers/Api";
import { z } from "zod";

type RegisterPatientReportProps = {
  patientId: string | null;
};

type UploadFileResponse = {
  fileUrl: string;
};

type MutationExamResponse = {
  id: string;
  patientId: string;
  date: string;
  author: string;
  type_of_exam: string;
  annotations: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
};

const registerExamFormSchema = z.object({
  date: z.string().nonempty("Selecione a data de realização do exame."),
  type_of_exam: z.string().nonempty("O exame precisa ter um nome."),
  author: z
    .string()
    .nonempty("Preencha o nome completo do responsável pelo exame.")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  annotations: z.string().optional(),
});

type registerExamFormData = z.infer<typeof registerExamFormSchema>;

const RegisterPatientExamModal: React.FC<RegisterPatientReportProps> = ({ patientId }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerExamFormData>({
    resolver: zodResolver(registerExamFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<any | undefined>();
  const [numPages, setNumPages] = useState<number | undefined>(undefined);

  const { isLoading, mutate } = useMutation({
    mutationKey: ["register-exam"],
    mutationFn: async (data: registerExamFormData) => {
      const formData = new FormData();
      formData.append("file", attachedFile);

      if (attachedFile != undefined) {
        const upload = await api.post<UploadFileResponse>(
          "uploads/file/",
          formData
        );

        await api.post<MutationExamResponse>("/exams", {
          ...data,
          patientId: patientId,
          filename: filename,
          fileUrl: upload.data.fileUrl,
          fileSize: attachedFile.size,
        });
      } else {
        await api.post<MutationExamResponse>("/exams", {
          ...data,
          patientId: patientId,
          filename: "",
          fileUrl: "",
          fileSize: 0,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-exams"] });
      if (isLoading != true) {
        reset();
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    if (open != true) {
      setAttachedFile(undefined);
      setFilename("");
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (attachedFile) {
      setHasAttachment(true);
    } else {
      setHasAttachment(false);
    }
  }, [attachedFile, setHasAttachment]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setAttachedFile(file);
      setFilename(String(file.name));
    }
  };

  const removeAttachment = () => {
    setAttachedFile(undefined);
    setFilename("");
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const send = (data: registerExamFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-[184px] h-10 border border-gray-200 rounded font-medium text-base text-brand-standard-black bg-white hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500">
        Registrar novo exame
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Registrar novo exame
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
          <div
            id="modal-scroll"
            className="w-full h-[402px] px-6 py-6 overflow-y-scroll"
          >
            <form
              onSubmit={handleSubmit(send)}
              className="w-full flex flex-col h-360"
            >
              <div className="w-full flex flex-col gap-6">
                <div className="w-[324px] flex flex-col gap-2">
                  <div className="w-[176px] flex flex-col gap-3">
                    <label
                      htmlFor="date"
                      className="w-full text-sm font-normal text-brand-standard-black"
                    >
                      Data de realização
                    </label>
                    <input
                      type="date"
                      className={
                        errors.date
                          ? "w-[176px] h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                          : "w-[176px] h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      }
                      {...register("date")}
                    />
                  </div>
                  {errors.date && (
                    <span className="text-xs font-normal text-red-500">
                      {errors.date.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-row gap-3">
                  <div className="w-[224px] flex flex-col gap-2">
                    <div className="w-[224px] flex flex-col gap-3">
                      <label
                        htmlFor="type_of_exam"
                        className="w-full text-sm font-normal text-brand-standard-black"
                      >
                        Tipo de exame
                      </label>
                      <input
                        type="text"
                        className={
                          errors.type_of_exam
                            ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                            : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        }
                        {...register("type_of_exam")}
                      />
                    </div>
                    {errors.type_of_exam && (
                      <span className="text-xs font-normal text-red-500">
                        {errors.type_of_exam.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[316.8px] flex flex-col gap-2">
                    <div className="w-[316.8px] flex flex-col gap-3">
                      <label
                        htmlFor="author"
                        className="w-full text-sm font-normal text-brand-standard-black"
                      >
                        Nome do responsável
                      </label>
                      <input
                        type="text"
                        className={
                          errors.author
                            ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                            : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        }
                        {...register("author")}
                      />
                    </div>
                    {errors.author && (
                      <span className="text-xs font-normal text-red-500">
                        {errors.author.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <label
                    htmlFor="annotations"
                    className="w-full text-sm font-normal text-brand-standard-black"
                  >
                    Anotações
                  </label>
                  <div>
                    <textarea
                      cols={30}
                      rows={6}
                      className="w-full px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register("annotations")}
                    ></textarea>
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
                          <TrashIcon color="#ef4444" width={16} height={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex justify-between">
                    {hasAttachment === true ? undefined : (
                      <div className="w-full flex">
                        <label
                          htmlFor="patient-photo-file"
                          className="border border-gray-200 flex items-center px-3 py-[6px] gap-1 rounded text-base text-brand-standard-black font-medium bg-white hover:border-[#b3b3b3] cursor-pointer"
                        >
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
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          id="patient-photo-file"
                          className="hidden"
                          onChange={handleFile}
                        />
                      </div>
                    )}
                    <div className="w-full h-10 flex justify-end">
                      <button
                        type="submit"
                        className="w-[120px] border border-gray-200 rounded font-medium text-base text-brand-standard-black bg-white hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500"
                      >
                        Salvar exame
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegisterPatientExamModal;
