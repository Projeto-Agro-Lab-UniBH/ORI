import * as Avatar from "@radix-ui/react-avatar";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useForm, useController } from "react-hook-form";
import { Label } from "../Label/Label";
import { Option } from "../../interfaces/Option";
import { ChangeEvent, KeyboardEventHandler, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../providers/Api";
import { Load } from "../Load/Load";
import { Patient } from "../../@types/Patient";
import { CameraIcon } from "@radix-ui/react-icons";

type EditPatientProps = {
  patientId: string;
  isOpen: boolean;
};

type GetPatientProfileResponse = {
  profile_photo: string;
  name: string;
  owner: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  entry_date: string;
  departure_date: string;
};

type GetEditedPatientResponse = {
  patient: Patient;
};

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

type editPatientProfileFormData = z.infer<typeof editPatientProfileFormSchema>;

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

const PatientProfileContent = (props: EditPatientProps) => {
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

  const [diagnosisInputValue, setDiagnosisInputValue] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fetchImage, setFetchImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [valueDiagnosis, setValueDiagnosis] = useState<readonly Option[]>([]);
  const { field: selectGender } = useController({ name: "gender", control });

  const { field: selectPhysicalShape } = useController({
    name: "physical_shape",
    control,
  });

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

  const [callRequest, setCallRequest] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { isLoading: isLoadingPatientData } = useQuery({
    queryKey: ["get-patient-by-id"],
    queryFn: async () => {
      await api
        .get<GetPatientProfileResponse>(`/patient/${props.patientId}`)
        .then((res) => {
          if ((res.data as GetPatientProfileResponse).diagnosis.length > 0) {
            setValueDiagnosis((res.data as GetPatientProfileResponse).diagnosis);
          }
          reset(res.data);
          setFetchImage(res.data.profile_photo);
        });
    },
    enabled: callRequest,
  });

  useEffect(() => {
    if (props.isOpen != true) {
      setCallRequest(false);
      setPhoto(null)
      reset();
    } else {
      setCallRequest(true);
    }
  }, [props.isOpen, setPhoto, setCallRequest, reset]);

  useEffect(() => {
    if (fetchImage) {
      setPhoto(fetchImage)
    } 
    if (previewImage) {
      setPhoto(previewImage)
    } 
  }, [photo, setPhoto, fetchImage, previewImage])

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

  const { isLoading: savingChanges, mutate } = useMutation({
    mutationKey: ["update-patient"],
    mutationFn: async (data: editPatientProfileFormData) => {
      await api.patch<GetEditedPatientResponse>(`/patient/${props.patientId}`, {
        ...data,
        profile_photo: photo,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("pacient-list");
    },
  });

  const send = (data: editPatientProfileFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
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
                    <Label htmlFor="entry_date" text="Data de entrada" />
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
                    <Label htmlFor="departure_date" text="Data de saída" />
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
                    <Label htmlFor="prognosis" text="Prognóstico" />
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "100%",
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
                      placeholder="Selecione a situação do paciente"
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
                  <Label htmlFor="name" text="Nome do paciente" />
                  <input
                    type="text"
                    className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                    {...register("name")}
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="w-full flex flex-col gap-3">
                  <Label htmlFor="specie" text="Espécie" />
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
                  <Label htmlFor="owner" text="Nome do dono(a)" />
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
                    <Label htmlFor="race" text="Raça" />
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
                    <Label htmlFor="physical_shape" text="Porte físico" />
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "100%",
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
                    <Label htmlFor="weight" text="Peso" />
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
                    <Label htmlFor="gender" text="Gênero" />
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "100%",
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
                  <Label
                    htmlFor="diagnosis"
                    text="Diagnóstico/Suspeita Clínica"
                  />
                  <CreatableSelect
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        width: "100%",
                        minHeight: 40,
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
            <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
              Salvar alterações
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PatientProfileContent;
