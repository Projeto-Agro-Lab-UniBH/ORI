import { z } from "zod";
import { FileCard } from "../Cards/FileCard";
import { Option } from "../../interfaces/Option";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController } from "react-hook-form";
import { CameraIcon, Cross1Icon } from "@radix-ui/react-icons";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import Load from "../Load/Load";
import Select from "react-select";
import ExamCard from "../Cards/ExamCard";
import ReportCard from "../Cards/ReportCard";
import CreatableSelect from "react-select/creatable";
import AddAttachmentModal from "./AddAttachmentModal";
import useEditPatientProfile from "../../hooks/useEditPatientProfile";
import useGetPatientProfile from "../../hooks/useGetPatientProfile";
import RegisterPatientReportModal from "./RegisterPatientReportModal";
import RegisterPatientExamModal from "./RegisterPatientExamModal";
import useListPatientReports from "../../hooks/useListPatientReports";
import useListPatientFiles from "../../hooks/useListPatientFiles";
import useListPatientExams from "../../hooks/useListPatientExams";

type EditPatientProfileModalProps = {
  patientId: string;
  children: React.ReactNode;
};

const createOption = (label: string) => ({
  label,
  value: label,
});

const genderOptions = [
  { label: "Macho", value: "Macho" },
  { label: "Fêmea", value: "Fêmea" },
];

const physicalShapeOptions = [
  { label: "Grande porte", value: "Grande porte" },
  { label: "Médio porte", value: "Médio porte" },
  { label: "Pequeno porte", value: "Pequeno porte" },
];

const prognosisOptions = [
  { label: "Alta", value: "Alta" },
  { label: "Aguardando alta médica", value: "Aguardando alta médica" },
  { label: "Obscuro", value: "Obscuro" },
  { label: "Desfávoravel", value: "Desfávoravel" },
  { label: "Reservado", value: "Reservado" },
  { label: "Favorável", value: "Favorável" },
  { label: "Risco", value: "Risco" },
  { label: "Alto risco", value: "Alto risco" },
];

const editPatientProfileFormSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: "O paciente precisa de um nome" })
      .transform((name) => {
        return name
          .trim()
          .split(" ")
          .map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          })
          .join(" ");
      }),
    owner: z.string().transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
    ownerless_patient: z.boolean(),
    specie: z.string().transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
    undefined_specie: z.boolean(),
    race: z.string().transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
    undefined_race: z.boolean(),
    gender: z.any(),
    weight: z.string(),
    prognosis: z.any(),
    diagnosis: z.any(),
    physical_shape: z.any(),
    entry_date: z.string().nonempty({ message: "Selecione a data de entrada" }),
    departure_date: z.string().optional(),
  })
  .superRefine((field, ctx) => {
    const addCustomIssue = (path: string[], message: string) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path,
      });
    };

    if (!field.owner && !field.ownerless_patient) {
      addCustomIssue(
        ["owner"],
        "Se o paciente não tem o nome do tutor identificado selecione à caixinha abaixo"
      );
    }

    if (!field.specie && !field.undefined_specie) {
      addCustomIssue(
        ["specie"],
        "Se o paciente não possui espécie definiada selecione à caixinha abaixo"
      );
    }

    if (!field.race && !field.undefined_race) {
      addCustomIssue(
        ["race"],
        "Se o paciente não possui raça definiada selecione à caixinha abaixo"
      );
    }
  });

export type editPatientProfileFormData = z.infer<
  typeof editPatientProfileFormSchema
>;

const EditPatientProfileModal: React.FC<EditPatientProfileModalProps> = ({
  patientId,
  children,
}) => {
  const {
    reset,
    register,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<editPatientProfileFormData>({
    resolver: zodResolver(editPatientProfileFormSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | undefined>(
    undefined
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);
  const [diagnosisInputValue, setDiagnosisInputValue] = useState("");
  const [valueDiagnosis, setValueDiagnosis] = useState<readonly Option[]>([]);

  const { field: selectPhysicalShape } = useController({
    name: "physical_shape",
    control,
  });
  const { field: selectGender } = useController({ name: "gender", control });
  const { field: selectPrognosis } = useController({
    name: "prognosis",
    control,
  });

  const {
    value: selectPhysicalShapeValue,
    onChange: selectPhysicalShapeOnChange,
    ...restSelectPhysicalShape
  } = selectPhysicalShape;

  const {
    value: selectGenderValue,
    onChange: selectGenderOnChange,
    ...restSelectGender
  } = selectGender;

  const {
    value: selectPrognosisValue,
    onChange: selectPrognosisOnChange,
    ...restSelectPrognosis
  } = selectPrognosis;

  const { isLoading: loadingPatientData } = useGetPatientProfile({
    id: patientId,
    reset: reset,
    setValueDiagnosis: setValueDiagnosis,
    setFetchedImage: setFetchedImage,
    callRequest: callRequest,
  });

  const { isLoading: savingProfileDataChanges, mutate } = useEditPatientProfile(
    {
      id: patientId,
      image: selectedImage,
    }
  );

  const { isLoading: loadingReports, data: patientReports } =
    useListPatientReports({
      patientId: patientId,
      callRequest: callRequest,
    });

  const { isLoading: loadingExams, data: patientExams } = useListPatientExams({
    patientId: patientId,
    callRequest: callRequest,
  });

  const { isLoading: loadingFiles, data: patientFiles } = useListPatientFiles({
    patientId: patientId,
    callRequest: callRequest,
  });

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
      setPreviewImage(null);
      setPhoto(null);
      reset();
    } else {
      setCallRequest(true);
    }
  }, [open, setPhoto, setCallRequest, reset]);

  useEffect(() => {
    if (fetchedImage) {
      setPhoto(fetchedImage);
    }
    if (previewImage) {
      setPhoto(previewImage);
    }
  }, [photo, setPhoto, fetchedImage, previewImage, open]);

  useEffect(() => {
    setValue("diagnosis", valueDiagnosis);
  }, [setValue, valueDiagnosis, valueDiagnosis?.length]);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
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

  const send = (data: editPatientProfileFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Tabs.Root defaultValue="profile">
      <Dialog.Root onOpenChange={setOpen} open={open}>
        <Dialog.Trigger className="w-full flex items-center hover:cursor-pointer gap-4">
          {children}
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed z-10" />
          <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-full px-6 mb-6 flex items-center flex-row justify-between">
              <Dialog.Title className="font-semibold text-2xl">
                Editar dados do paciente
              </Dialog.Title>
              <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
                <Cross1Icon width={24} height={24} />
              </Dialog.Close>
            </div>
            <div className="w-full">
              <Tabs.List className="w-full h-10 pl-6 flex flex-wrap -mb-px text-sm font-medium text-center border-b border-gray-200">
                <Tabs.Trigger
                  value="profile"
                  id="button-tab"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Perfil
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="reports"
                  id="button-tab"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Relatórios
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="exams"
                  id="button-tab"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Exames
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="attachments"
                  id="button-tab"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Arquivos
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="profile">
                {loadingPatientData && (
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
                {savingProfileDataChanges && (
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
                  className="w-full h-[488px] px-6 py-6 overflow-y-scroll"
                >
                  <form
                    className="w-full flex flex-col gap-10"
                    onSubmit={handleSubmit(send)}
                  >
                    <div className="w-full flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-2">
                        <div className="w-full flex items-center gap-4">
                          <div className="w-[72px] flex items-center flex-col gap-2">
                            <div className="w-full flex items-center justify-center">
                              <span className="text-sm font-normal text-brand-standard-black">
                                Foto
                              </span>
                            </div>
                            <div className="w-full flex items-center justify-center">
                              <Avatar.Root
                                className={
                                  !photo
                                    ? "w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                                    : "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                                }
                              >
                                {!photo ? (
                                  <div className="w-4 h-4">
                                    <CameraIcon
                                      className="w-full h-full object-cover"
                                      color="#e5e7eb"
                                    />
                                  </div>
                                ) : (
                                  <Avatar.Image
                                    className="w-full h-full object-cover"
                                    src={photo}
                                  />
                                )}
                              </Avatar.Root>
                            </div>
                          </div>
                          <div className="w-full h-full flex">
                            <div className="w-full flex justify-center flex-col gap-1">
                              <label
                                htmlFor="patient-photo-file"
                                className="w-[156px] text-base font-normal text-blue-500 cursor-pointer"
                              >
                                Selecionar uma foto
                              </label>
                              <input
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                id="patient-photo-file"
                                className="hidden"
                                onChange={handleImage}
                              />
                              <div className="w-full">
                                <div className="w-[516px] flex flex-col">
                                  <p className="w-16 text-sm font-normal text-brand-standard-black ">
                                    Dica:
                                  </p>
                                  <p className="w-[500px] text-gray-500 font-normal text-sm whitespace-nowrap">
                                    Uma foto de perfil do paciente o ajuda a ser
                                    reconhecido na plataforma.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-44">
                          <div className="w-44 flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="entry_date"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Data de entrada
                              </label>
                              <input
                                type="date"
                                className={
                                  errors.entry_date
                                    ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                                    : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                }
                                {...register("entry_date")}
                              />
                            </div>
                            {errors.entry_date && (
                              <span className="text-xs font-normal text-red-500">
                                {errors.entry_date.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-44">
                          <div className="w-44 flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="departure_date"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Data de saída
                              </label>
                              <input
                                type="date"
                                className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                {...register("departure_date")}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="prognosis"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Prognóstico
                              </label>
                              <Select
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                    height: 40,
                                    borderColor: state.isFocused
                                      ? "#e2e8f0"
                                      : "#e2e8f0",
                                    borderRadius: 4,
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
                                  colors: {
                                    ...theme.colors,
                                    primary75: "#cbd5e1",
                                    primary50: "##e2e8f0",
                                    primary25: "#f8fafc",
                                    primary: "#212529",
                                  },
                                })}
                                placeholder="Selecione o prognóstico"
                                isSearchable={false}
                                options={prognosisOptions}
                                value={
                                  selectPrognosisValue
                                    ? prognosisOptions.find(
                                        (x) => x.value === selectPrognosisValue
                                      )
                                    : selectPrognosisValue
                                }
                                onChange={(option) =>
                                  selectPrognosisOnChange(
                                    option ? option.value : option
                                  )
                                }
                                {...restSelectPrognosis}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-[368px]">
                          <div className="w-[368px] flex flex-col gap-2">
                            <div className="w-[368px] flex flex-col gap-3">
                              <label
                                htmlFor="name"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Nome do paciente
                              </label>
                              <input
                                type="text"
                                className={
                                  errors.name
                                    ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                                    : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                }
                                {...register("name")}
                              />
                            </div>
                            {errors.name && (
                              <span
                                className={"text-xs font-normal text-red-500"}
                              >
                                {errors.name.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="specie"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Espécie
                              </label>
                              {watch("undefined_specie") == true && (
                                <input
                                  type="text"
                                  className="w-full h-10 px-3 py-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                                  disabled
                                />
                              )}
                              {watch("undefined_specie") == false && (
                                <input
                                  type="text"
                                  className={
                                    errors.specie &&
                                    watch("undefined_specie") == false
                                      ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                                      : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                  }
                                  {...register("specie")}
                                />
                              )}
                            </div>
                            {errors.specie && (
                              <span
                                className={
                                  watch("undefined_specie") == false
                                    ? "text-xs font-normal text-red-500"
                                    : "hidden text-xs font-normal text-red-500"
                                }
                              >
                                {errors.specie.message}
                              </span>
                            )}
                            <div className="w-full flex items-center gap-1">
                              <input
                                type="checkbox"
                                id="checkbox2"
                                {...register("undefined_specie")}
                              ></input>
                              <label
                                htmlFor="checkbox2"
                                className="text-xs font-normal text-gray-500"
                              >
                                Sem espécie definida.
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-[368px]">
                          <div className="w-[368px] flex flex-col gap-2">
                            <div className="w-[368px] flex flex-col gap-3">
                              <label
                                htmlFor="owner"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Nome do tutor(a)
                              </label>
                              {watch("ownerless_patient") == true && (
                                <input
                                  type="text"
                                  className="w-full h-10 px-3 py-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                                  disabled
                                />
                              )}
                              {watch("ownerless_patient") == false && (
                                <input
                                  type="text"
                                  className={
                                    errors.owner &&
                                    watch("ownerless_patient") == false
                                      ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                                      : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                  }
                                  {...register("owner")}
                                />
                              )}
                            </div>
                            {errors.owner && (
                              <span
                                className={
                                  watch("ownerless_patient") == false
                                    ? "text-xs font-normal text-red-500"
                                    : "hidden text-xs font-normal text-red-500"
                                }
                              ></span>
                            )}
                            <div className="w-full flex items-center gap-1">
                              <input
                                type="checkbox"
                                id="checkbox3"
                                {...register("ownerless_patient")}
                              ></input>
                              <label
                                htmlFor="checkbox3"
                                className="text-xs font-normal text-gray-500"
                              >
                                Não foi identificado o tutor do paciente.
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="race"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Raça
                              </label>
                              {watch("undefined_race") == true && (
                                <input
                                  type="text"
                                  className="w-full h-10 px-3 py-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                                  disabled
                                />
                              )}
                              {watch("undefined_race") == false && (
                                <input
                                  type="text"
                                  className={
                                    errors.race &&
                                    watch("undefined_race") == false
                                      ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                                      : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                  }
                                  {...register("race")}
                                />
                              )}
                            </div>
                            {errors.race && (
                              <span
                                className={
                                  watch("undefined_race") == false
                                    ? "text-xs font-normal text-red-500"
                                    : "hidden text-xs font-normal text-red-500"
                                }
                              >
                                {errors.race.message}
                              </span>
                            )}
                            <div className="w-full flex items-center gap-1">
                              <input
                                type="checkbox"
                                id="checkbox4"
                                {...register("undefined_race")}
                              ></input>
                              <label
                                htmlFor="checkbox4"
                                className="text-xs font-normal text-gray-500"
                              >
                                Sem raça definida.
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-44">
                          <div className="w-44 flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="physical_shape"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Porte físico
                              </label>
                              <Select
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                    height: 40,
                                    borderColor: state.isFocused
                                      ? "#e2e8f0"
                                      : "#e2e8f0",
                                    borderRadius: 4,
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
                                  colors: {
                                    ...theme.colors,
                                    primary75: "#cbd5e1",
                                    primary50: "##e2e8f0",
                                    primary25: "#f8fafc",
                                    primary: "#212529",
                                  },
                                })}
                                placeholder="Selecione"
                                isSearchable={false}
                                options={physicalShapeOptions}
                                value={
                                  selectPhysicalShapeValue
                                    ? physicalShapeOptions.find(
                                        (x) =>
                                          x.value === selectPhysicalShapeValue
                                      )
                                    : selectPhysicalShapeValue
                                }
                                onChange={(option) =>
                                  selectPhysicalShapeOnChange(
                                    option ? option.value : option
                                  )
                                }
                                {...restSelectPhysicalShape}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-44">
                          <div className="w-44 flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="weight"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Peso
                              </label>
                              <input
                                type="text"
                                className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                {...register("weight")}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                              <label
                                htmlFor="gender"
                                className="w-full text-sm font-normal text-brand-standard-black"
                              >
                                Gênero
                              </label>
                              <Select
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                    height: 40,
                                    borderColor: state.isFocused
                                      ? "#e2e8f0"
                                      : "#e2e8f0",
                                    borderRadius: 4,
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
                                  colors: {
                                    ...theme.colors,
                                    primary75: "#cbd5e1",
                                    primary50: "##e2e8f0",
                                    primary25: "#f8fafc",
                                    primary: "#212529",
                                  },
                                })}
                                placeholder="Selecione o sexo do paciente"
                                isSearchable={false}
                                options={genderOptions}
                                onChange={(option) =>
                                  selectGenderOnChange(
                                    option ? option.value : option
                                  )
                                }
                                value={
                                  selectGenderValue
                                    ? genderOptions.find(
                                        (x) => x.value === selectGenderValue
                                      )
                                    : selectGenderValue
                                }
                                {...restSelectGender}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="w-full flex flex-col gap-5">
                          <div className="w-full flex flex-col gap-3">
                            <label
                              htmlFor="diagnosis"
                              className="w-full text-sm font-normal text-brand-standard-black"
                            >
                              Diagnóstico / Suspeita Clínica
                            </label>
                            <CreatableSelect
                              styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  width: "100%",
                                  minHeight: 40,
                                  borderColor: state.isFocused
                                    ? "#e2e8f0"
                                    : "#e2e8f0",
                                  borderRadius: 4,
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
                                colors: {
                                  ...theme.colors,
                                  primary75: "#cbd5e1",
                                  primary50: "##e2e8f0",
                                  primary25: "#f8fafc",
                                  primary: "#212529",
                                },
                              })}
                              components={{ DropdownIndicator: null }}
                              inputValue={diagnosisInputValue}
                              isClearable
                              isMulti
                              menuIsOpen={false}
                              onChange={(newValue) =>
                                setValueDiagnosis(newValue)
                              }
                              onInputChange={(newValue) =>
                                setDiagnosisInputValue(newValue)
                              }
                              onKeyDown={handleKeyDown}
                              placeholder="Digite o nome da doença diagnosticada/suspeita clínica e depois aperte a tecla 'Enter'"
                              value={valueDiagnosis}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-11 flex items-center justify-end">
                      <button
                        type="submit"
                        className="w-[152px] border border-gray-200 px-2 py-2 rounded font-medium text-base text-brand-standard-black bg-white shadow-md hover:shadow-blue-500/50 hover:border-none hover:text-neutral-50 hover: hover:bg-blue-500"
                      >
                        Salvar alterações
                      </button>
                    </div>
                  </form>
                </div>
              </Tabs.Content>
              <Tabs.Content value="reports">
                {loadingReports && (
                  <div className="w-full h-full absolute z-20">
                    <div className="w-full h-full bg-[#f9fafb8b]">
                      <Load
                        divProps={{
                          className:
                            "w-full h-[362px] relative flex items-center justify-center bg-gray-500-50",
                        }}
                      />
                    </div>
                  </div>
                )}
                <div
                  id="modal-scroll"
                  className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
                >
                  <div className="w-full flex flex-col items-center gap-6">
                    {patientReports &&
                      patientReports?.map((data) => (
                        <ReportCard
                          key={data.id}
                          id={data.id}
                          patientId={data.patientId}
                          shift={data.shift}
                          author={data.author}
                          title={data.title}
                          report_text={data.report_text}
                          filename={data.filename}
                          fileUrl={data.fileUrl}
                          createdAt={data.createdAt}
                          updatedAt={data.updatedAt}
                        />
                      ))}
                  </div>
                </div>
                <div className="w-full flex justify-end px-6 py-6">
                  <RegisterPatientReportModal patientId={patientId} />
                </div>
              </Tabs.Content>
              <Tabs.Content value="exams">
                {loadingExams && (
                  <div className="w-full h-full absolute z-20">
                    <div className="w-full h-full bg-[#f9fafb8b]">
                      <Load
                        divProps={{
                          className:
                            "w-full h-[362px] relative flex items-center justify-center bg-gray-500-50",
                        }}
                      />
                    </div>
                  </div>
                )}
                <div
                  id="modal-scroll"
                  className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
                >
                  <div className="w-full flex flex-col items-center gap-6">
                    {patientExams &&
                      patientExams.map((data) => (
                        <ExamCard
                          key={data.id}
                          id={data.id}
                          patientId={data.patientId}
                          date={data.date}
                          author={data.author}
                          type_of_exam={data.type_of_exam}
                          annotations={data.annotations}
                          filename={data.filename}
                          fileUrl={data.fileUrl}
                          fileSize={data.fileSize}
                          createdAt={data.createdAt}
                          updatedAt={data.updatedAt}
                        />
                      ))}
                  </div>
                </div>
                <div className="w-full flex justify-end px-6 py-6">
                  <RegisterPatientExamModal patientId={patientId} />
                </div>
              </Tabs.Content>
              <Tabs.Content value="attachments">
                {loadingFiles && (
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
                  className="w-full h-[488px] px-6 py-6 overflow-y-scroll"
                >
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="w-full flex justify-start">
                      <AddAttachmentModal patientId={patientId} />
                    </div>
                    <div className="w-full grid grid-cols-3 gap-[28px]">
                      {patientFiles &&
                        patientFiles?.map((data) => (
                          <FileCard
                            key={data.id}
                            id={data.id}
                            filename={data.filename}
                            fileUrl={data.fileUrl}
                            fileSize={data.fileSize}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Tabs.Root>
  );
};

export default EditPatientProfileModal;
