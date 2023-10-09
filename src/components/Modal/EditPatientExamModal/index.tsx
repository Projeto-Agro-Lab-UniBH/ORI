import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from '@radix-ui/react-scroll-area';

import SpinnerLoad from "../../Shared/Loads/SpinnerLoad";
import CreatableSelect from "react-select/creatable";

import { z } from "zod";
import { useMutation, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { Cross1Icon, DownloadIcon, ExclamationTriangleIcon, UploadIcon } from "@radix-ui/react-icons";
import { Document, Page } from "react-pdf";

import { api } from "../../../providers/Api";
import { queryClient } from "../../../providers/QueryClient";
import { Option } from "../../../interfaces/Option";
import { GetExamResponse, PatchExamResponse } from "../../../@types/ApiResponse";
import { format } from "date-fns";

import * as locale from 'date-fns/locale';

type EditPatientExamModalProps = {
  id: string;
};

const createOption = (label: string) => ({ 
  label, 
  value: label 
});

const editExamFormSchema = z.object({
  execution_date: z.string().nonempty("Selecione a data de realização do exame."),
  runtime: z.string().nonempty("O tempo de execução do exame não pode ser branco."),
  execution_period: z.string().nonempty("O período em que foi feito o exame não pode ser branco."),
  responsible_person: z.string().nonempty("Digite o nome do responsável que fez o exame"),
  type_of_exam: z.string().nonempty("Digite o tipo de exame feito"),
  exam_name: z.string().nonempty("Digite o nome do exame"),
  diagnosis: z.any(),
  prognosis: z.string().optional(),
  description_of_treatment: z.string().max(1000, { message: "O texto de descrição do tratamento não pode conter mais do que 1000 caracteres."}).optional(),
});

type editExamFormData = z.infer<typeof editExamFormSchema>;

const EditPatientExamModal: React.FC<EditPatientExamModalProps> = ({ id: examId }) => {
  const { reset, register, setValue, handleSubmit, formState: { errors } } = useForm<editExamFormData>({
    resolver: zodResolver(editExamFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [numPages, setNumPages] = useState<number | undefined>(undefined);
  // const [download, setDownload] = useState<any>({} as any);
  // const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  // const [filename, setFilename] = useState<string>("");
  // const [fecthedFilename, setFetchedFilename] = useState<string>("");
  // const [fecthedAttachment, setFecthedAttachment] = useState<string>("");
  // const [attachedFile, setAttachedFile] = useState<File | undefined>();
  // const [attachment, setAttachment] = useState<File | undefined>();
  // const [isRemovingRecord, setIsRemovingRecord] = useState<boolean>(false);
  const [diagnosisInputValue, setDiagnosisInputValue] = useState("");
  const [valueDiagnosis, setValueDiagnosis] = useState<readonly Option[]>([]);

  const { data } = useQuery({
    queryKey: ["get-exam-by-id"],
    queryFn: async () => {
      setIsLoading(true);
      await api.get<GetExamResponse>(`/exams/${examId}`).then((res) => {
        if ((res.data as GetExamResponse).diagnosis.length > 0) {
          setValueDiagnosis(
            (res.data as GetExamResponse).diagnosis
          );
        }
        reset(res.data);
      });
      setIsLoading(false);
    },
    enabled: callRequest,
  })

  const { isLoading: isUpdating, mutate } = useMutation({
    mutationKey: ["update-patient-exam"],
    mutationFn: async (data: editExamFormData) => {
      await api.patch<PatchExamResponse>(`/exams/${examId}`, {...data})
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
      // setAttachedFile(undefined);
      // setFecthedAttachment("");
      // setAttachment(undefined);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [open, setCallRequest, reset]);

  useEffect(() => {
    setValue("diagnosis", valueDiagnosis);
  }, [setValue, valueDiagnosis, valueDiagnosis?.length]);

  // useEffect(() => {
  //   if (data.filename != null || "") {
  //     setFetchedFilename(data.filename);
  //   }
  //   if (data.fileUrl != null || "") {
  //     setFecthedAttachment(data.fileUrl);
  //   }
  // }, [data, setFetchedFilename, setFecthedAttachment]);

  // useEffect(() => {
  //   if (attachedFile) {
  //     setFetchedFilename("");
  //     setFecthedAttachment("");
  //   }
  // }, [attachment, setAttachment, fecthedAttachment, attachedFile]);

  // useEffect(() => {
  //   if (data.fileUrl) {
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = `${data.fileUrl}`;
  //     setDownload(downloadLink);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (fecthedAttachment || attachedFile) {
  //     setHasAttachment(true);
  //   } else {
  //     setHasAttachment(false);
  //   }
  // }, [fecthedAttachment, attachedFile, setHasAttachment]);

  useEffect(() => {
    setValue("diagnosis", valueDiagnosis);
  }, [setValue, valueDiagnosis, valueDiagnosis?.length]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      // setAttachedFile(file);
      // setFilename(file.name);
    }
  };

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!diagnosisInputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValueDiagnosis((prev) => [
          ...prev,
          createOption(diagnosisInputValue),
        ]);
        setDiagnosisInputValue("");
        event.preventDefault();
    }
  };

  // const downloadFile = (event: any) => {
  //   event.preventDefault();
  //   download.click();
  // };

  // const removeFecthedAttachment = () => {
  //   setFetchedFilename("");
  //   setFecthedAttachment("");
  // };

  // const removeAttachment = () => {
  //   setAttachedFile(undefined);
  //   setFilename("");
  // };

  // const onDocumentLoadSuccess = ({ numPages }: any) => {
  //   setNumPages(numPages);
  // };

  const onSubmit = (data: editExamFormData) => {
    mutate(data);
  };

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
              Editar exame
            </Dialog.Title>
            <Dialog.Close className="h-8 bg-transparent flex justify-center items-center">
              <Cross1Icon
                className="text-slate-400 hover:text-slate-500"
                width={24}
                height={24}
              />
            </Dialog.Close>
          </div>
          {(isLoading || isUpdating) && (
            <div className="w-full h-full absolute z-20">
              <div className="w-full h-full bg-[#f9fafb8b]">
                <SpinnerLoad
                  divProps={{
                    className:
                      "w-full h-[488px] relative flex items-center justify-center bg-slate-500-50",
                  }}
                />
              </div>
            </div>
          )}
          <ScrollArea.Root className="w-full h-[402px] overflow-hidden">
            <ScrollArea.Viewport className="w-full h-full px-6 py-6">
              <div className="w-full flex flex-col gap-6">
                {/* <div className="flex flex-col gap-4">
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
                </div>  */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full flex flex-col h-360"
                >
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex flex-row gap-3">
                      <div className="w-[176px] flex flex-col gap-2">
                        <div className="w-[176px] flex flex-col gap-3">
                          <label
                            htmlFor="execution_date"
                            className="w-full font-medium text-sm text-slate-700"
                          >
                            Data de realização
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
                      <div className="w-full">
                        <div className="w-[176px] flex flex-col gap-2">
                          <div className="w-full flex flex-col gap-3">
                            <label
                              htmlFor="runtime"
                              className="w-full font-medium text-sm text-slate-700"
                            >
                              Tempo de execução
                            </label>
                            <input
                              type="text"
                              className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                                errors.runtime
                                  ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                              }`}
                              {...register("runtime")}
                            />
                          </div>
                          {errors.runtime && (
                            <span className="font-normal text-xs text-red-400">
                              {errors.runtime.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-[176px]">
                        <div className="w-[176px] flex flex-col gap-2">
                          <div className="w-[176px] flex flex-col gap-3">
                            <label
                              htmlFor="execution_period"
                              className="w-full font-medium text-sm text-slate-700"
                            >
                              Período
                            </label>
                            <input
                              type="text"
                              className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                                errors.execution_period
                                  ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                              }`}
                              {...register("execution_period")}
                            />
                          </div>
                          {errors.execution_period && (
                            <span className="font-normal text-xs text-red-400">
                              {errors.execution_period.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-row gap-3">
                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col gap-3">
                          <label
                            htmlFor="responsible_person"
                            className="w-full font-medium text-sm text-slate-700"
                          >
                            Nome do responsável
                          </label>
                          <input
                            type="text"
                            className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                              errors.responsible_person
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("responsible_person")}
                          />
                        </div>
                        {errors.responsible_person && (
                          <span className="font-normal text-xs text-red-400">
                            {errors.responsible_person.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex flex-row gap-3">
                      <div className="w-[288px] flex flex-col gap-2">
                        <div className="w-[288px] flex flex-col gap-3">
                          <label
                            htmlFor="type_of_exam"
                            className="w-full font-medium text-sm text-slate-700"
                          >
                            Tipo de exame
                          </label>
                          <input
                            type="text"
                            className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                              errors.type_of_exam
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("type_of_exam")}
                          />
                        </div>
                        {errors.type_of_exam && (
                          <span className="font-normal text-xs text-red-400">
                            {errors.type_of_exam.message}
                          </span>
                        )}
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col gap-3">
                          <label
                            htmlFor="exam_name"
                            className="w-full font-medium text-sm text-slate-700"
                          >
                            Nome do exame
                          </label>
                          <input
                            type="text"
                            className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                              errors.exam_name
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("exam_name")}
                          />
                        </div>
                        {errors.exam_name && (
                          <span className="font-normal text-xs text-red-400">
                            {errors.exam_name.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col gap-3">
                          <label
                            htmlFor="diagnosis"
                            className="w-full font-medium text-sm text-slate-700"
                          >
                            Diagnóstico / Suspeita Clínica
                          </label>
                          <CreatableSelect
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                                height: 41.6,
                                borderRadius: 8,
                                borderColor: state.isFocused
                                  ? "#64748b"
                                  : "#cbd5e1",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                fontWeight: 400,
                                fontFamily: "Inter",
                                fontSize: "0.875rem",
                                lineHeight: "1.25rem",
                              }),
                              input: (styles) => ({
                                ...styles,
                                borderRadius: 8,
                                fontWeight: 400,
                                fontFamily: "Inter",
                                borderColor: "#cbd5e1",
                                ":hover": { borderColor: "#94a3b8" },
                              }),
                              dropdownIndicator: (styles) => ({
                                ...styles,
                                color: "#94a3b8",
                                ":hover": { color: "#64748b" },
                              }),
                              clearIndicator: (styles) => ({
                                ...styles,
                                color: "#94a3b8",
                                ":hover": { color: "#64748b" },
                              }),
                              indicatorSeparator: (styles) => ({
                                ...styles,
                                backgroundColor: "#94a3b8",
                              }),
                              placeholder: (styles) => ({
                                ...styles,
                                fontWeight: 400,
                                fontFamily: "Inter",
                                color: "#94a3b8",
                              }),
                              multiValue: (styles) => {
                                return {
                                  ...styles,
                                  borderRadius: 8,
                                  backgroundColor: "#e0f2fe",
                                };
                              },
                              multiValueLabel: (styles) => ({
                                ...styles,
                                color: "#0ea5e9",
                              }),
                              multiValueRemove: (styles) => ({
                                ...styles,
                                borderRadius: 8,
                                color: "#0ea5e9",
                                ":hover": {
                                  backgroundColor: "#7dd3fc",
                                  color: "white",
                                },
                              }),
                            }}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 4,
                              colors: {
                                ...theme.colors,
                                primary50: "#f8fafc",
                                primary25: "#f8fafc",
                                primary: "#0f172a",
                              },
                            })}
                            components={{ DropdownIndicator: null }}
                            inputValue={diagnosisInputValue}
                            isClearable
                            isMulti
                            menuIsOpen={false}
                            onChange={(newValue) => setValueDiagnosis(newValue)}
                            onInputChange={(newValue) =>
                              setDiagnosisInputValue(newValue)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder=""
                            value={valueDiagnosis}
                          />
                        </div>
                        <span className="text-xs font-normal text-slate-500">
                          <strong className="font-medium">Instrução: </strong>{" "}
                          Digite o nome da doença diagnosticada/suspeita clínica e
                          depois aperte a tecla{" "}
                          <strong className="font-medium">Enter</strong> ou{" "}
                          <strong className="font-medium">Tab.</strong>
                        </span>
                      </div>
                    </div>
                    {/* <div className="w-full flex flex-col gap-3">
                    <div className="max-w-xl">
                      <label className="flex justify-center w-full h-24 px-4 transition bg-white border border-slate-300 border-dashed rounded-lg appearance-none hover:border-slate-400 focus:outline-none cursor-pointer">
                        <span className="flex items-center space-x-2">
                          <UploadIcon width={20} height={20} />
                          <span className="font-medium text-slate-600">
                            Pegue e arraste o arquivo para anexar aqui
                          </span>
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          id="attachfile"
                          className="hidden"
                          onChange={handleFile}
                        />
                      </label>
                    </div>
                  </div> */}
                    {/* {attachedFile && (
                    <div className="w-[552.8px] border rounded border-slate-300 overflow-hidden flex flex-col items-center">
                      <div className="w-[552.8px] h-44 overflow-hidden">
                        <Document
                          file={attachedFile}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={1} width={552.8} />
                        </Document>
                      </div>
                      <div className="w-[552.8px] h-14 border-t-[1px] border-slate-300 flex items-center p-2 gap-2">
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
                            className="w-7 h-7 flex justify-center items-center bg-white border rounded border-slate-300 overflow-hidden cursor-pointer"
                          >
                            <TrashIcon color="#ef4444" width={16} height={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )} */}
                    <div className="w-full flex flex-row gap-3">
                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex flex-col gap-3">
                          <label
                            htmlFor="prognosis"
                            className="w-full font-medium text-sm text-slate-700"
                          >
                            Prognóstico
                          </label>
                          <input
                            type="text"
                            className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
                              errors.prognosis
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("prognosis")}
                          />
                        </div>
                        {errors.prognosis && (
                          <span className="font-normal text-xs text-red-400">
                            {errors.prognosis.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="description_of_treatment"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Descrição do tratamento
                        </label>
                        <textarea
                          rows={14}
                          className={`resize-none block w-full rounded-lg border-0 p-[12px] text-sm text-slate-900 ring-1 ring-inset ${
                            errors.description_of_treatment
                              ? "ring-red-300 placeholder:text-red-400 focus:outline-red-500 focus:ring-1 focus:ring-inset focus:ring-red-500"
                              : "ring-slate-300 placeholder:text-slate-400 focus:outline-slate-500 focus:ring-1 focus:ring-inset focus:ring-slate-500"
                          }`}
                          {...register("description_of_treatment")}
                        ></textarea>
                      </div>
                      {errors.description_of_treatment && (
                        <span className="font-normal text-xs text-red-400">
                          {errors.description_of_treatment.message}
                        </span>
                      )}
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <div className="w-full h-10 flex justify-end">
                        <button
                          type="submit"
                          className="w-[120px] h-10 border border-slate-300 rounded-lg font-medium text-base text-slate-700 bg-white hover:border-none hover:text-white hover:bg-blue-500"
                        >
                          Salvar exame
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
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
  );
};

export default EditPatientExamModal;