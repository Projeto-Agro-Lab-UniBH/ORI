import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import Load from "../Load/Load";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { z } from "zod";
import { api } from "../../providers/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "../../providers/QueryClient";
import { CameraIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Option } from "../../interfaces/Option";
import { useController, useForm } from "react-hook-form";
import { useState, KeyboardEventHandler, useEffect, ChangeEvent } from "react";
import { useMutation } from "react-query";

type UploadImageResponse = {
  imageUrl: string;
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
  { value: "Grande porte", label: "Grande porte" },
  { value: "Médio porte", label: "Médio porte" },
  { value: "Pequeno porte", label: "Pequeno porte" },
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

const registerPatientFormSchema = z.object({
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

type registerPatientFormData = z.infer<typeof registerPatientFormSchema>;

const RegisterPatientModal = () => {
  const { reset, register, watch, setValue, control, handleSubmit, formState: { errors }, } =
    useForm<registerPatientFormData>({
      resolver: zodResolver(registerPatientFormSchema),
    });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any | undefined>(
    undefined
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [diagnosisInputValue, setDiagnosisInputValue] = useState<string>("");
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

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { isLoading, mutate } = useMutation({
    mutationKey: ["create-patient"],
    mutationFn: async (data: registerPatientFormData) => {
      const formData = new FormData();
      formData.append("image", selectedImage);

      if (selectedImage != null || undefined) {
        const upload = await api.post<UploadImageResponse>(
          "uploads/image/",
          formData
        );

        await api.post("/patient", {
          ...data,
          profile_photo: upload.data.imageUrl,
        });
      } else {
        await api.post("/patient", {
          ...data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
      if (isLoading != true) {
        setIsOpen(false);
        reset();
      }
    },
  });

  useEffect(() => {
    setValue("diagnosis", valueDiagnosis);
  }, [setValue, valueDiagnosis, valueDiagnosis?.length]);

  useEffect(() => {
    if (isOpen != true) {
      setSelectedImage(undefined);
      setPreviewImage(null);
      setValueDiagnosis([]);
      reset();
    }
  }, [isOpen, setPreviewImage, setValueDiagnosis, reset]);

  const send = (data: registerPatientFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger className="w-10 h-10 border rounded flex justify-center items-center hover:boder hover:border-[#b3b3b3]">
        <PlusIcon color="#212529" width={20} height={20} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-10" />
        <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Cadastrar paciente
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
            className="w-full h-[488px] px-6 pt-6 pb-6 overflow-y-scroll"
          >
            <form
              onSubmit={handleSubmit(send)}
              className="w-full flex flex-col gap-10"
            >
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex items-center gap-4">
                  <div className="w-[72px] h-full flex items-center flex-col gap-2">
                    <div className="w-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-brand-standard-black">
                        Foto
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <Avatar.Root className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden">
                        <Avatar.Image
                          src={previewImage as string | undefined}
                          className="w-full h-full object-cover"
                        />
                        <Avatar.Fallback className="w-16 h-16 border border-gray-200 flex items-center justify-center rounded-full overflow-hidden" delayMs={600}>
                          <CameraIcon width={16} height={16} color="#e5e7eb" />    
                        </Avatar.Fallback>
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
                    <div className="w-44 flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="departure_date"
                          className="w-full text-sm font-normal text-brand-standard-black"
                        >
                          Data de saída
                        </label>
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
                        {watch("undefined_specie") == true ? (
                          <input
                            type="text"
                            className="w-full h-10 px-3 py-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className={
                              errors.specie 
                                ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                                : "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                            }
                            {...register("specie")}
                            />
                          )
                        }
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
                        {watch("ownerless_patient") == true ? (
                          <input
                            type="text"
                            className="w-full h-10 px-3 py-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className={
                              errors.owner 
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
                        {watch("undefined_race") == true ? (
                          <input
                            type="text"
                            className="w-full h-10 px-3 py-3 bg-gray-100 border border-gray-200 rounded cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className={
                              errors.race 
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
                          value={
                            selectGenderValue
                              ? genderOptions.find(
                                  (x) => x.value === selectGenderValue
                                )
                              : selectGenderValue
                          }
                          onChange={(option) =>
                            selectGenderOnChange(option ? option.value : option)
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
                        Diagnóstico/Suspeita Clínica
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
              <div className="w-full h-10 flex items-center justify-end">
                <button 
                  type="submit" 
                  className="w-24 h-10 border border-gray-200 rounded font-medium text-base text-brand-standard-black bg-white hover:border-none hover:text-neutral-50 hover:bg-blue-500"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegisterPatientModal;
