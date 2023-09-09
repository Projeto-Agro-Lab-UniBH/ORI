import Image from "next/image";
import Load from "../../Load/Load";
import Select from "react-select";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useController, useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { api } from "../../../providers/Api";
import { Document, Page } from "react-pdf";
import { formatFileSize } from "../../../functions/formatBytes";
import { queryClient } from "../../../providers/QueryClient";
import { z } from "zod";

type RegisterPatientReportProps = {
  patientId: string | null;
};

type UploadFileResponse = {
  fileUrl: string;
};

type MutationReportResponse = {
  id: string;
  patientId: string;
  shift: string;
  author: string;
  title: string;
  report_text: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
};

const turnOptions = [
  { label: "Matutino", value: "Matutino" },
  { label: "Diurno", value: "Diurno" },
  { label: "Noturno", value: "Noturno" },
];

const registerReportFormSchema = z.object({
  shift: z.any(),
  author: z
    .string()
    .nonempty("Preencha o seu nome completo.")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  title: z.string().nonempty("O relatório precisa ter um título."),
  report_text: z.string().optional(),
});

type registerReportFormData = z.infer<typeof registerReportFormSchema>;

const RegisterPatientReportModal: React.FC<RegisterPatientReportProps> = ({ patientId }) => {
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<registerReportFormData>({
    resolver: zodResolver(registerReportFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [attachedFile, setAttachedFile] = useState<any | undefined>();
  const [filename, setFilename] = useState<string>("");

  const { field: selectShift } = useController({ name: "shift", control });
  const {
    value: selectShiftValue,
    onChange: selectShiftOnChange,
    ...restSelectShift
  } = selectShift;

  const { isLoading, mutate } = useMutation({
    mutationKey: ["create-report"],
    mutationFn: async (data: registerReportFormData) => {
      const formData = new FormData();
      formData.append("file", attachedFile);

      if (attachedFile != undefined) {
        const upload = await api.post<UploadFileResponse>(
          "uploads/file/",
          formData
        );

        await api.post<MutationReportResponse>("/reports", {
          ...data,
          patientId: patientId,
          filename: filename,
          fileUrl: upload.data.fileUrl,
          fileSize: attachedFile.size,
        });
      } else {
        await api.post<MutationReportResponse>("/reports", {
          ...data,
          patientId: patientId,
          filename: "",
          fileUrl: "",
          fileSize: 0,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-reports"] });
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

  const send = (data: registerReportFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-[164px] h-10 border border-gray-200 rounded font-medium text-base text-brand-standard-black bg-white hover:border-none hover:text-neutral-50 hover:bg-blue-500">
        Criar novo relatório
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Criar novo relatório
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
              className="w-full flex flex-col h-360 gap-6"
            >
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex flex-row gap-3">
                  <div className="w-[184px] flex flex-col gap-3">
                    <label
                      htmlFor="shift"
                      className="w-full text-sm font-normal text-brand-standard-black"
                    >
                      Turno
                    </label>
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: 184,
                          height: 40,
                          borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          fontFamily: "Inter",
                          fontWeight: 400,
                          fontSize: "0.875rem",
                          lineHeight: "1.25rem",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 4,
                        colors: {
                          ...theme.colors,
                          primary75: "#cbd5e1",
                          primary50: "##e2e8f0",
                          primary25: "#f8fafc",
                          primary: "#212529",
                        },
                      })}
                      placeholder="Selecione o turno"
                      isSearchable={false}
                      options={turnOptions}
                      value={
                        selectShiftValue
                          ? turnOptions.find(
                              (x) => x.value === selectShiftValue
                            )
                          : selectShiftValue
                      }
                      onChange={(option) =>
                        selectShiftOnChange(option ? option.value : option)
                      }
                      {...restSelectShift}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-3">
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
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex flex-col gap-3">
                    <label
                      htmlFor="author"
                      className="w-full text-sm font-normal text-brand-standard-black"
                    >
                      Título
                    </label>
                    <input
                      type="text"
                      className={
                        errors.title
                          ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                          : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      }
                      {...register("title")}
                    />
                  </div>
                  {errors.title && (
                    <span className="text-xs font-normal text-red-500">
                      {errors.title.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-col gap-3">
                  <label
                    htmlFor="report_text"
                    className="w-full text-sm font-normal text-brand-standard-black"
                  >
                    Descrição / Relatório
                  </label>
                  <div>
                    <textarea
                      cols={30}
                      rows={10}
                      className="w-full px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register("report_text")}
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
              </div>
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
                    className="w-[132px] h-10 border border-gray-200 rounded font-medium text-base text-brand-standard-black bg-white hover:border-none hover:text-neutral-50 hover:bg-blue-500"
                  >
                    Salvar relatório
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegisterPatientReportModal;
