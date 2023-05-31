import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { Label } from "../Label/Label";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../providers/Api";
import { Load } from "../Load/Load";
import Select from "react-select";
import { z } from "zod";

type EditReportProps = {
  id: string;
  patientId: string;
};

const editReportFormSchema = z.object({
  shift: z.any(),
  author: z.string().nonempty("Nome completo não pode ser nulo"),
  report_text: z.string().nonempty("Relatório não pode ser nulo"),
  attachments: z.string(),
});

type editReportFormData = z.infer<typeof editReportFormSchema>;

type ReportResponse = {
  id: string;
  patientId: string;
  shift: string;
  author: string;
  report_text: string;
  createdAt: string;
  updatedAt: string;
  attachments: string;
};

type ReportData = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

const turnOptions = [
  { value: "Matutino", label: "Matutino" },
  { value: "Diurno", label: "Diurno" },
  { value: "Noturno", label: "Noturno" },
];

const EditReportModal = (props: EditReportProps) => {
  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<editReportFormData>({
    resolver: zodResolver(editReportFormSchema),
  });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ReportData>({} as ReportData);
  const [callRequest, setCallRequest] = useState<boolean>(false);

  const { field: selectShift } = useController({
    name: "shift",
    control,
  });

  const {
    value: selectShiftValue,
    onChange: selectShiftOnChange,
    ...restSelectShift
  } = selectShift;

  const { isLoading: isLoadingPatientReportData } = useQuery({
    queryKey: ["get-report-by-id"],
    queryFn: async () => {
      await api.get<ReportResponse>(`/reports/${props.id}`).then((res) => {
        reset(res.data);
        setData(res.data);
      });
    },
    enabled: callRequest,
  });

  const { isLoading: savingChanges, mutate } = useMutation({
    mutationKey: ["update-patient"],
    mutationFn: async (data: editReportFormData) => {
      await api.patch<ReportResponse>(`/reports/${props.id}`, {
        ...data,
        patientId: props.patientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("list-all-reports");
    },
  });

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [open, setCallRequest, reset]);

  const send = (data: editReportFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  const [file, setFile] = useState<string | undefined>()

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0].name
    console.log(file)
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <div className="px-1 py-1 border-none rounded hover:bg-gray-50">
        <Dialog.Trigger className="w-16 flex items-center gap-1 text-brand-standard-black font-semibold">
          <Pencil2Icon /> Editar
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Editar relatório
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          <div className="w-full px-6 py-6 flex flex-col gap-4">
            {isLoadingPatientReportData ? (
              <Load
                divProps={{
                  className:
                    "w-full h-[488px] flex items-center justify-center relative bg-gray-500-50",
                }}
              />
            ) : savingChanges ? (
              <Load
                divProps={{
                  className:
                    "w-full h-[488px] flex items-center justify-center relative bg-gray-500-50",
                }}
              />
            ) : (
              <>
                <div className="w-full flex justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-standard-black">
                      ID:
                    </span>
                    <p className="text-base font-normal text-brand-standard-black">
                      {data?.id}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-brand-standard-black">
                        Data de criação:
                      </span>
                      <p className="text-base font-normal text-brand-standard-black">
                        {data?.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-brand-standard-black">
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
                  className="w-full flex flex-col h-360 gap-3"
                >
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex flex-row gap-3">
                      <div className="w-[184px] flex flex-col gap-3">
                        <Label htmlFor="shift" text="Turno" />
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
                        <Label htmlFor="author" text="Veterinário responsável" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                          {...register("author")}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="report_text" text="Relatório" />
                      <div>
                        <textarea
                          cols={30}
                          rows={10}
                          className="w-full px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                          {...register("report_text")}
                        ></textarea>
                        {errors.report_text && (
                          <span className="w-full mt-1 flex items-center font-normal text-sm text-red-500">
                            {errors.report_text.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-3">
                    <div className="w-[558.4px] flex items-center">
                      <p className="w-[558.4px] max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis text-sm font-normal text-brand-standard-black">
                        {}
                      </p>
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
                        <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                          Salvar alterações
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditReportModal;
