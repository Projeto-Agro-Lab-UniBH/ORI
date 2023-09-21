import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import SpinnerLoad from "../../Load/SpinnerLoad";
import Select from "react-select";
import { z } from "zod";
import { api } from "../../../providers/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "../../../providers/QueryClient";
import { CameraIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Option } from "../../../interfaces/Option";
import { useController, useForm } from "react-hook-form";
import { useState, useEffect, ChangeEvent } from "react";
import { useMutation } from "react-query";
import VerticalScrollbar from "../../Scrollbar/VerticalScrollbar";

type UploadImageResponse = {
  imageUrl: string;
};

const genderOptions: Option[] = [
  { label: "Macho", value: "Macho" },
  { label: "Fêmea", value: "Fêmea" },
];

const physicalShapeOptions: Option[] = [
  { value: "Grande porte", label: "Grande porte" },
  { value: "Médio porte", label: "Médio porte" },
  { value: "Pequeno porte", label: "Pequeno porte" },
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
  owner: z.string(),
  ownerless_patient: z.boolean(),
  specie: z.string(),
  undefined_specie: z.boolean(),
  race: z.string(),
  undefined_race: z.boolean(),
  gender: z.any(),
  weight: z.string(),
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
  const { reset, register, watch, handleSubmit, control, formState: { errors },
  } = useForm<registerPatientFormData>({
    resolver: zodResolver(registerPatientFormSchema),
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { field: selectPhysicalShape } = useController({ name: "physical_shape", control });
  const { value: selectPhysicalShapeValue, onChange: selectPhysicalShapeOnChange, ...restSelectPhysicalShape } = selectPhysicalShape;
  
  const { field: selectGender } = useController({ name: "gender", control });
  const { value: selectGenderValue, onChange: selectGenderOnChange, ...restSelectGender } = selectGender;

  useEffect(() => {
    if (isOpen != true) {
      setSelectedImage(undefined);
      setPreviewImage(null);
      reset();
    }
  }, [isOpen, setPreviewImage, reset]);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  console.log(selectPhysicalShapeValue)
  console.log(selectGenderValue)

  const { isLoading, mutate } = useMutation({
    mutationKey: ["create-patient"],
    mutationFn: async (data: registerPatientFormData) => {
      if (selectedImage != undefined) {
        const formData = new FormData();
        formData.append("image", selectedImage);

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

  const onSubmit = (data: registerPatientFormData) => {
    const request = {
      ...data,
    };
    mutate(request);
  };

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger className="w-10 h-10 rounded flex justify-center items-center bg-blue-500 hover:bg-blue-600">
        <PlusIcon color="#ffff" width={20} height={20} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-10" />
        <Dialog.Content className="w-[720px] rounded-lg border-none bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-full px-6 pb-4 border-b-[1px] border-slate-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl text-slate-700">
              Cadastrar paciente
            </Dialog.Title>
            <Dialog.Close className="h-8 bg-transparent flex justify-center items-center">
              <Cross1Icon className="text-slate-400 hover:text-slate-500" width={24} height={24} />
            </Dialog.Close>
          </div>
          {isLoading && (
            <div className="w-full h-full absolute z-20">
              <div className="w-full h-full bg-[#f9fafb8b]">
                <SpinnerLoad
                  divProps={{
                    className:
                      "w-full h-[488px] relative flex items-center justify-center bg-gray-500-50",
                  }}
                />
              </div>
            </div>
          )}
          <VerticalScrollbar styleViewportArea="w-full h-[488px] px-6 py-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-[64px]"
            >
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex items-center gap-4">
                  <div className="w-[72px] h-full flex items-center flex-col gap-2">
                    <div className="w-full flex items-center justify-center">
                      <span className="font-medium text-sm text-slate-700">
                        Foto
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <Avatar.Root
                        className={`w-16 h-16 flex items-center justify-center ${
                          previewImage ? "" : "border border-slate-300"
                        } rounded-full overflow-hidden`}
                      >
                        {previewImage ? (
                          <Avatar.Image
                            src={previewImage as string | undefined}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CameraIcon width={16} height={16} color="#cbd5e1" />
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
                          <p className="w-16 font-medium text-sm text-slate-700">
                            Dica:
                          </p>
                          <p className="w-[500px] font-normal text-sm text-slate-400 whitespace-nowrap">
                            Uma foto de perfil do paciente o ajuda a ser
                            reconhecido na plataforma.
                          </p>
                        </div>
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
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Nome do paciente
                        </label>
                        <input
                          type="text"
                          className={`w-full h-10 px-3 py-3 font-normal text-sm text-shark-950 bg-white rounded border border-solid ${
                            errors.name
                              ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                          }`}
                          {...register("name")}
                        />
                      </div>
                      {errors.name && (
                        <span className={"font-normal text-xs text-red-400"}>
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
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Espécie
                        </label>
                        {watch("undefined_specie") == true ? (
                          <input
                            type="text"
                            className="w-full h-10 px-3 py-3 text-slate-200 bg-slate-200 border border-solid border-slate-300 rounded cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className={`w-full h-10 px-3 py-3 text-sm text-shark-950 font-normal bg-white rounded border border-solid ${
                              errors.specie
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("specie")}
                          />
                        )}
                      </div>
                      {errors.specie && (
                        <span
                          className={
                            watch("undefined_specie") == false
                              ? "font-normal text-xs text-red-400"
                              : "hidden font-normal text-xs text-red-400"
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
                          className="font-normal text-xs text-slate-400"
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
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Nome do tutor(a)
                        </label>
                        {watch("ownerless_patient") == true ? (
                          <input
                            type="text"
                            className="w-full h-10 px-3 py-3 text-slate-200 bg-slate-200 border border-solid border-slate-300 rounded cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className={`w-full h-10 px-3 py-3 text-sm text-shark-950 font-normal bg-white rounded border border-solid ${
                              errors.owner
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("owner")}
                          />
                        )}
                      </div>
                      {errors.owner && (
                        <span
                          className={
                            watch("ownerless_patient") == false
                              ? "font-normal text-xs text-red-400"
                              : "hidden font-normal text-xs text-red-400"
                          }
                        >
                          {errors.owner.message}
                        </span>
                      )}
                      <div className="w-full flex items-center gap-1">
                        <input
                          type="checkbox"
                          id="checkbox3"
                          {...register("ownerless_patient")}
                        ></input>
                        <label
                          htmlFor="checkbox3"
                          className="font-normal text-xs text-slate-400"
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
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Raça
                        </label>
                        {watch("undefined_race") == true ? (
                          <input
                            type="text"
                            className="w-full h-10 px-3 py-3 text-slate-200 bg-slate-200 border border-solid border-slate-300 rounded cursor-not-allowed"
                            disabled
                          />
                        ) : (
                          <input
                            type="text"
                            className={`w-full h-10 px-3 py-3 text-sm text-shark-950 font-normal bg-white rounded border border-solid ${
                              errors.race
                                ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                            }`}
                            {...register("race")}
                          />
                        )}
                      </div>
                      {errors.race && (
                        <span
                          className={
                            watch("undefined_race") == false
                              ? "font-normal text-xs text-red-400"
                              : "hidden font-normal text-xs text-red-400"
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
                          className="font-normal text-xs text-slate-400"
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
                          className="w-full font-medium text-sm text-slate-700"
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
                            indicatorSeparator: (styles) => ({
                              ...styles,
                              backgroundColor: "#94a3b8"
                            }),
                            placeholder: (styles) => ({
                              ...styles,
                              fontWeight: 400,
                              fontFamily: "Inter",
                              color: "#94a3b8",
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
                          placeholder="Selecione o porte"
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
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Peso
                        </label>
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-shark-950 font-normal bg-white rounded border border-solid border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
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
                          className="w-full font-medium text-sm text-slate-700"
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
                            indicatorSeparator: (styles) => ({
                              ...styles,
                              backgroundColor: "#94a3b8"
                            }),
                            placeholder: (styles) => ({
                              ...styles,
                              fontWeight: 400,
                              fontFamily: "Inter",
                              color: "#94a3b8",
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
                            selectGenderOnChange(
                              option ? option.value : option
                            )
                          }
                          {...restSelectGender}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full h-10 flex items-center justify-end">
                <button
                  type="submit"
                  className="w-24 h-10 border border-slate-300 rounded font-medium text-base text-slate-700 bg-white hover:border-none hover:text-white hover:bg-blue-500"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </VerticalScrollbar>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegisterPatientModal;
