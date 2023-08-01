import { z } from "zod";
import Select from "react-select";
import { Load } from "../Load/Load";
import * as Tabs from "@radix-ui/react-tabs";
import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { Option } from "../../interfaces/Option";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController } from "react-hook-form";
import { CameraIcon, Cross1Icon, FileTextIcon } from "@radix-ui/react-icons";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import useEditPatientData from "../../hooks/useEditPatientData";
import useGetPatientData from "../../hooks/useGetPatientData";
import StakedReportList from "../Lists/StakedReportList";
import RegisterReportModal from "./RegisterReportModal";
import CreatableSelect from "react-select/creatable";
import AddAttachmentModal from "./AddAttachmentModal";
import StakedExamList from "../Lists/StakedExamList";
import RegisterExamModal from "./RegisterExamModal";

type EditPatientModalProps = {
  patientId: string;
	children: React.ReactNode;
}

const editPatientProfileFormSchema = z.object({
  name: z.string().nonempty(),
  owner: z.string(),
  specie: z.string(),
  race: z.string(),
  gender: z.any(),
  weight: z.string(),
  prognosis: z.any(),
  diagnosis: z.any(),
  physical_shape: z.any(),
  entry_date: z.string(),
  departure_date: z.string(),
});

export type editPatientProfileFormData = z.infer<typeof editPatientProfileFormSchema>;

const createOption = (label: string) => ({
  label,
  value: label,
});

const genderOptions = [
  { value: "Macho", label: "Macho" },
  { value: "Fêmea", label: "Fêmea" },
];

const physicalShapeOptions = [
  { value: "Grande porte", label: "Grande porte" },
  { value: "Médio porte", label: "Médio porte" },
  { value: "Pequeno porte", label: "Pequeno porte" },
];

const prognosisOptions = [
  { value: "Alta", label: "Alta" },
  { value: "Aguardando alta médica", label: "Aguardando alta médica" },
  { value: "Obscuro", label: "Obscuro" },
  { value: "Desfávoravel", label: "Desfávoravel" },
  { value: "Reservado", label: "Reservado" },
  { value: "Favorável", label: "Favorável" },
  { value: "Risco", label: "Risco" },
  { value: "Alto risco", label: "Alto risco" },
];

const EditPatientModal = (props: EditPatientModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const {
    reset,
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<editPatientProfileFormData>({
    resolver: zodResolver(editPatientProfileFormSchema),
  });

  const [files, setFiles] = useState<FileList>({} as FileList);

  const [diagnosisInputValue, setDiagnosisInputValue] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [valueDiagnosis, setValueDiagnosis] = useState<readonly Option[]>([]);

  const { field: selectPhysicalShape } = useController({ name: "physical_shape", control });
  const { value: selectPhysicalShapeValue, onChange: selectPhysicalShapeOnChange, ...restSelectPhysicalShape } = selectPhysicalShape;
  const { field: selectGender } = useController({ name: "gender", control });
  const { value: selectGenderValue, onChange: selectGenderOnChange,...restSelectGender } = selectGender;
  const { field: selectPrognosis } = useController({ name: "prognosis", control });
  const { value: selectPrognosisValue, onChange: selectPrognosisOnChange, ...restSelectPrognosis } = selectPrognosis;

  const { isLoading: isLoadingPatientData } = useGetPatientData({
    id: props.patientId,
    reset: reset,
    setValueDiagnosis: setValueDiagnosis,
    setFetchedImage: setFetchedImage,
    callRequest: callRequest,
  });

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
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
  }, [photo, setPhoto, fetchedImage, previewImage]);

  useEffect(() => {
    setValue("diagnosis", valueDiagnosis);
  }, [setValue, valueDiagnosis, valueDiagnosis?.length]);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const { isLoading: savingChanges, mutate } = useEditPatientData({
    id: props.patientId,
    photo: photo
  });

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
          {props.children}
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
                  Relatório
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
                  Documentos & Anexos
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="profile" >
                <div
                  id="modal-scroll"
                  className="w-full h-[488px] px-6 py-6 overflow-y-scroll"
                >
                  {isLoadingPatientData ? (
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
                    <form
                      className="w-full flex flex-col gap-10"
                      onSubmit={handleSubmit(send)}
                    >
                      <div className="w-full flex flex-col gap-6">
                        <div className="w-full flex flex-col gap-2">
                          <div className="w-full flex items-center gap-4">
                            <div className="w-[72px] flex items-center flex-col gap-2">
                              <div className="w-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-brand-standard-black">
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
                                  className="w-[156px] text-base font-normal text-[#4573D2] cursor-pointer"
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
                                    <p className="w-16 text-brand-standard-black font-semibold text-sm">
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
                          <div className="w-full h-10 flex items-center gap-2">
                            <span className="text-sm font-semibold text-brand-standard-black">
                              ID:
                            </span>
                            <p className="text-base font-normal text-brand-standard-black">
                              {props?.patientId}
                            </p>
                          </div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                          <div className="w-44">
                            <div className="w-44 flex flex-col gap-6">
                              <div className="w-full flex flex-col gap-3">
                                <label htmlFor="entry_date" className="w-full text-sm font-normal text-brand-standard-black">Data de entrada</label>
                                <input
                                  type="text"
                                  className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                  {...register("entry_date")}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-44">
                            <div className="w-44 flex flex-col gap-6">
                              <div className="w-full flex flex-col gap-3">
                                <label htmlFor="departure_date" className="w-full text-sm font-normal text-brand-standard-black">Data de saída</label>
                                <input
                                  type="text"
                                  className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                  {...register("departure_date")}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="w-full flex flex-col gap-6">
                              <div className="w-full flex flex-col gap-3">
                                <label htmlFor="prognosis" className="w-full text-sm font-normal text-brand-standard-black">Prognóstico</label>
                                <Select
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      width: "100%",
                                      height: 40,
                                      borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
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
                                    selectPrognosisOnChange(option ? option.value : option)
                                  }
                                  {...restSelectPrognosis}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                          <div className="w-[368px]">
                            <div className="w-[368px] flex flex-col gap-3">
                              <label htmlFor="name" className="w-full text-sm font-normal text-brand-standard-black">Nome do paciente</label>
                              <input
                                type="text"
                                className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                {...register("name")}
                              />
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="w-full flex flex-col gap-3">
                              <label htmlFor="specie" className="w-full text-sm font-normal text-brand-standard-black">Espécie</label>
                              <input
                                type="text"
                                className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                {...register("specie")}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                          <div className="w-[368px]">
                            <div className="w-[368px] flex flex-col gap-3">
                              <label htmlFor="owner" className="w-full text-sm font-normal text-brand-standard-black">Nome do tutor(a)</label>
                              <input
                                type="text"
                                className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                {...register("owner")}
                              />
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="w-full flex flex-col gap-6">
                              <div className="w-full flex flex-col gap-3">
                                <label htmlFor="race" className="w-full text-sm font-normal text-brand-standard-black">Raça</label>
                                <input
                                  type="text"
                                  className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                                  {...register("race")}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                          <div className="w-44">
                            <div className="w-44 flex flex-col gap-6">
                              <div className="w-full flex flex-col gap-3">
                                <label htmlFor="physical_shape" className="w-full text-sm font-normal text-brand-standard-black">Porte físico</label>
                                <Select
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      width: "100%",
                                      height: 40,
                                      borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
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
                                          (x) => x.value === selectPhysicalShapeValue
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
                                <label htmlFor="weight" className="w-full text-sm font-normal text-brand-standard-black">Peso</label>
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
                                <label htmlFor="gender" className="w-full text-sm font-normal text-brand-standard-black">Gênero</label>
                                <Select
                                  styles={{
                                    control: (baseStyles, state) => ({
                                      ...baseStyles,
                                      width: "100%",
                                      height: 40,
                                      borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
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
                                    selectGenderOnChange(option ? option.value : option)
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
                              <label htmlFor="diagnosis" className="w-full text-sm font-normal text-brand-standard-black">Diagnóstico/Suspeita Clínica</label>
                              <CreatableSelect
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                    minHeight: 40,
                                    borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
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
                                onChange={(newValue) => setValueDiagnosis(newValue)}
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
                      <div className="w-full flex justify-end">
                        <button
                          type="submit"
                          className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50"
                        >
                          Salvar alterações
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Tabs.Content>
              <Tabs.Content value="reports">
                <div id="modal-scroll" className="w-full h-[362px] px-6 py-6 overflow-y-scroll">
                  <StakedReportList patientId={props.patientId} />
                </div>
                <div className="w-full flex justify-end px-6 py-6">
                  <RegisterReportModal patientId={props.patientId} />
                </div>
              </Tabs.Content>
              <Tabs.Content value="exams">
                <div
                  id="modal-scroll"
                  className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
                >
                  <StakedExamList />
                </div>
                <div className="w-full flex justify-end px-6 py-6">
                  <RegisterExamModal />
                </div>
              </Tabs.Content>
              <Tabs.Content value="attachments">
                <div id="modal-scroll" className="w-full h-[488px] px-6 py-6 overflow-y-scroll">
                  <div className="w-full flex flex-col items-center gap-6">
                    <div className="w-full flex justify-start">
                      <AddAttachmentModal patientId={props.patientId} setFiles={setFiles} files={files} />
                    </div>
                    <div className="w-full grid grid-cols-4 gap-[28px]">
                      {Array.from(files).map((file, i) => (
                        <div key={i} className="w-[146px] h-[146px] border rounded border-gray-200 flex items-center justify-center flex-col">
                          <FileTextIcon key={i} height={100} width={100} />
                          {file.name}
                        </div>
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

export default EditPatientModal;
