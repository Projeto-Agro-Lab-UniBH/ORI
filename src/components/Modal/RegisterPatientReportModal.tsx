import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, Cross2Icon, FileIcon } from "@radix-ui/react-icons";
import { useController, useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerReportFormData, registerReportFormSchema } from "../../schemas/registerReportFormSchema";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../providers/Api";
import { Load } from "../Load/Load";
import Select from "react-select";

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
  attachments: string; 
  createdAt: string;
  updatedAt: string;
};

const turnOptions = [
  { value: "Matutino", label: "Matutino" },
  { value: "Diurno", label: "Diurno" },
  { value: "Noturno", label: "Noturno" },
];

const RegisterPatientReportModal = (props: RegisterPatientReportProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { reset, register, control, handleSubmit, formState: { errors } } = 
    useForm<registerReportFormData>({
      resolver: zodResolver(registerReportFormSchema),
    });

  const [attachedFile, setAttachedFile] = useState<any | undefined>();
  const [previewAttachedFile, setPreviewAttachedFile] = useState<string>("");

  const { field: selectShift } = useController({ name: "shift", control });
  const { value: selectShiftValue, onChange: selectShiftOnChange, ...restSelectShift } = selectShift;
  
  const queryClient = useQueryClient();  

  const { isLoading, mutate } = useMutation({
    mutationKey: ["create-report"],
    mutationFn: async (data: registerReportFormData) => {
      const formData = new FormData();
      formData.append('file', attachedFile);

      if (attachedFile != undefined) {
        const upload = await api.post<UploadFileResponse>('uploads/file/', formData)

        await api.post<MutationReportResponse>("/reports", {
          ...data,
          patientId: props.patientId,
          filename: previewAttachedFile,
          attachment: upload
        });
      } else {
        await api.post<MutationReportResponse>("/reports", {
          ...data,
          patientId: props.patientId,
          filename: '',
          attachment: ''
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-reports"] });
      reset();
      setOpen(false);
    },
  });

  useEffect(() => {
    if (open != true) {
      setAttachedFile(undefined);
      setPreviewAttachedFile("");
      reset();
    }
  }, [open, reset]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setAttachedFile(file);
      setPreviewAttachedFile(file.name)
    }
  }

  const removeAttachment = () => {
    setAttachedFile(undefined);
    setPreviewAttachedFile("");
  }

  const send = (data: registerReportFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
        Criar um relatório
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Criar um novo relatório
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          {isLoading && 
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
          }
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
                    <label htmlFor="shift" className="w-full text-sm font-normal text-brand-standard-black">Turno</label>
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
                  <div className="w-full flex flex-col gap-3">
                    <label htmlFor="author" className="w-full text-sm font-normal text-brand-standard-black">Nome do responsável</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register("author")}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <label htmlFor="author" className="w-full text-sm font-normal text-brand-standard-black">Título</label>
                  <input
                    type="text"
                    className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                    {...register("title")}  
                  />
                </div>
                <div className="w-full flex flex-col gap-3">
                  <label htmlFor="report_text" className="w-full text-sm font-normal text-brand-standard-black">Descrição / Relatório</label>
                  <div>
                    <textarea
                      cols={30}
                      rows={10}
                      className="w-full px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register("report_text")}
                    ></textarea>
                  </div>
                </div>
                {attachedFile &&  
                  <div className="w-full flex gap-3 items-center">
                    <div className="w-[558.4px] px-2 py-2 flex justify-between items-center border rounded">
                      <div className="w-[488px] gap-2 flex items-center">
                        <FileIcon width={20} height={20} />
                        <p className="w-[500px] max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium text-brand-standard-black">
                          {previewAttachedFile}
                        </p>
                      </div>
                      <button onClick={removeAttachment}>
                        <Cross2Icon />
                      </button>
                    </div>
                  </div>
                }
              </div>
              <div className="w-full flex justify-between">
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
                <div className="w-full flex justify-end">
                  <button type="submit" className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                    Salvar
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
