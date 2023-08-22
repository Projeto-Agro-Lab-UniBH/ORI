import Image from "next/image";
import Select from "react-select";
import { useMutation } from "react-query";
import { api } from "../../providers/Api";
import * as Dialog from "@radix-ui/react-dialog";
import { Document, Page } from "react-pdf";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Cross1Icon, DownloadIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { editReportFormData, editReportFormSchema } from "../../schemas/editReportFormSchema";
import WarningToDeleteReportModal from "./WarningToDeleteReportModal";
import useGetPatientReport from "../../hooks/useGetPatientReport";
import { formatFileSize } from "../../functions/formatBytes";
import { queryClient } from "../../providers/QueryClient";
import Load from "../Load/Load";

type EditPatientReportModalProps = {
  id: string;
  patientId: string;
};

type UploadFileResponse = {
  fileUrl: string;
};

type ReportData = {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
};

type ReportResponse = {
  id: string;
  patientId: string;
  shift: string;
  author: string;
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

/*
 * Tarefas do componente:  
 * Resolver o botão de dowload
 * Isolar os botões da função padrão do useForm
 */

const EditPatientReportModal = (props: EditPatientReportModalProps) => {
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<editReportFormData>({
    resolver: zodResolver(editReportFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ReportData>({} as ReportData);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [download, setDownload] = useState<any>({} as any);
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");
  const [fecthedFilename, setFetchedFilename] = useState<string>("");
  const [fecthedAttachment, setFecthedAttachment] = useState<string>("");
  const [attachedFile, setAttachedFile] = useState<any | undefined>();
  const [attachment, setAttachment] = useState<any | undefined>();

  const { field: selectShift } = useController({ name: "shift", control });
  const {
    value: selectShiftValue,
    onChange: selectShiftOnChange,
    ...restSelectShift
  } = selectShift;

  const { isLoading } = useGetPatientReport({
    id: props.id,
    callRequest: callRequest,
    reset: reset,
    setData: setData,
  });

  const { isLoading: savingChanges, mutate } = useMutation({
    mutationKey: ["update-patient-report"],
    mutationFn: async (data: editReportFormData) => {
      const formData = new FormData();
      formData.append("file", attachedFile);

      if (attachedFile != undefined && fecthedAttachment === "") {
        const upload = await api.post<UploadFileResponse>(
          "uploads/file/",
          formData
        );

        await api.patch<ReportResponse>(`/reports/${props.id}`, {
          ...data,
          filename: filename,
          fileUrl: upload.data.fileUrl,
          fileSize: attachedFile.size
        });
      }
      if (fecthedAttachment != "" && attachedFile === undefined) {
        await api.patch<ReportResponse>(`/reports/${props.id}`, {
          ...data,
        });
      }
      if (fecthedAttachment === "" && attachedFile === undefined) {
        await api.patch<ReportResponse>(`/reports/${props.id}`, {
          ...data,
          filename: "",
          fileUrl: "",
          fileSize: 0,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-reports"] });
      if (savingChanges != true) {
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
      setAttachedFile(undefined);
      setFecthedAttachment("");
      setAttachment(undefined);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [open, setCallRequest, setAttachedFile, reset]);

  useEffect(() => {
    if (data.filename != null || "") {
      setFetchedFilename(data.filename);
    }
    if (data.fileUrl != null || "") {
      setFecthedAttachment(data.fileUrl);
    }
  }, [data, setFetchedFilename, setFecthedAttachment]);

  useEffect(() => {
    if (attachedFile) {
      setFetchedFilename("");
      setFecthedAttachment("");
    }
  }, [attachment, setAttachment, fecthedAttachment, attachedFile]);

  useEffect(() => {
    if (data.fileUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = `${data.fileUrl}`;
      setDownload(downloadLink);
    }
  }, [data]);

  useEffect(() => {
    if (fecthedAttachment || attachedFile) {
      setHasAttachment(true);
    } else {
      setHasAttachment(false);
    }
  }, [fecthedAttachment, attachedFile, setHasAttachment]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setAttachedFile(file);
      setFilename(file.name);
    }
  };

  const removeFecthedAttachment = () => {
    setFetchedFilename("");
    setFecthedAttachment("");
  };

  const removeAttachment = () => {
    setAttachedFile(undefined);
    setFilename("");
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const send = (data: editReportFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <div className="px-2 py-1 border border-gray-200 rounded hover:border-[#b3b3b3] flex items-center text-brand-standard-black font-semibold gap-1">
        <Dialog.Trigger className="w-16 flex items-center gap-1 text-brand-standard-black font-semibold">
          <Pencil2Icon /> Editar
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Editar relatório
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
          {savingChanges && (
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
          <div id="modal-scroll" className="w-full h-[402px] overflow-y-scroll">
            <div className="w-full px-6 py-6 flex flex-col gap-4">
              <div className="w-full flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-brand-standard-black">
                    ID:
                  </span>
                  <p className="text-base font-normal text-brand-standard-black">
                    {data?.id}
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold text-brand-standard-black">
                      Data de criação:
                    </span>
                    <p className="text-base font-normal text-brand-standard-black">
                      {data?.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold text-brand-standard-black">
                      Data da última edição:
                    </span>
                    <p className="text-base font-normal text-brand-standard-black">
                      {data?.updatedAt}
                    </p>
                  </div>
                </div>
              </div>
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
                            borderColor: state.isFocused
                              ? "#e2e8f0"
                              : "#e2e8f0",
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
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="author"
                        className="w-full text-sm font-normal text-brand-standard-black"
                      >
                        Veterinário responsável
                      </label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register("author")}
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <label
                      htmlFor="author"
                      className="w-full text-sm font-normal text-brand-standard-black"
                    >
                      Título
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register("title")}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <label
                      htmlFor="report_text"
                      className="w-full text-sm font-normal text-brand-standard-black"
                    >
                      Relatório
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
                  {fecthedAttachment && (
                    <div className="w-[552.8px] border rounded border-gray-200 overflow-hidden flex flex-col items-center">
                      <div className="w-[552.8px] h-44 overflow-hidden">
                        <Document
                          file={fecthedAttachment}
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
                              {fecthedFilename
                                .split(".")
                                .slice(0, -1)
                                .join(".")}
                            </p>
                          </div>
                          <div className="w-80 flex flex-row items-center text-center gap-1">
                            <span className="text-[10px] font-light">
                              {numPages} páginas
                            </span>
                            <span className="text-[10px] font-light">•</span>
                            <span className="text-[10px] font-light">
                              {fecthedFilename.split(".").pop()?.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-light">•</span>
                            <span className="text-[10px] font-light">
                              {formatFileSize(data.fileSize)}
                            </span>
                          </div>
                        </div>
                        <div className="w-[176.8px] flex justify-end">
                          <div className="flex gap-2">
                            {/* <button
                              onClick={() => download.click()}
                              className="w-7 h-7 flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer"
                            >
                              <DownloadIcon
                                color="#212529"
                                width={16}
                                height={16}
                              />
                            </button> */}
                            <button
                              onClick={removeFecthedAttachment}
                              className="w-7 h-7 flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer"
                            >
                              <TrashIcon
                                color="#212529"
                                width={16}
                                height={16}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                </div>
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
                          accept=".doc, .docx, .pdf"
                          id="patient-photo-file"
                          className="hidden"
                          onChange={handleFile}
                        />
                      </div>
                    )}
                    <div className="w-full flex justify-end gap-2">
                      <WarningToDeleteReportModal
                        id={props.id}
                        modalIsOpen={setOpen}
                      />
                      <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                        Salvar alterações
                      </button>
                    </div>
                  </div>
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
