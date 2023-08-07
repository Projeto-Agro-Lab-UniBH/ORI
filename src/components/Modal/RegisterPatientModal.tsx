import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { CameraIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import Select from "react-select";
import { Option } from "../../interfaces/Option";
import CreatableSelect from "react-select/creatable";
import { useController, useForm } from "react-hook-form";
import { useState, KeyboardEventHandler, useEffect, ChangeEvent } from "react";
import { useMutation, useQueryClient } from "react-query"
import { Load } from "../Load/Load";
import { api } from "../../providers/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerPatientFormData, registerPatientFormSchema } from "../../schemas/registerPatientFormSchema";

type UploadImageResponse = {
  imageUrl: string;
};

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

const RegisterPatientModal = () => {
  const queryClient = useQueryClient();
  const { reset, register, setValue, control, handleSubmit } =
    useForm<registerPatientFormData>({
      resolver: zodResolver(registerPatientFormSchema),
    });
    
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [diagnosisInputValue, setDiagnosisInputValue] = useState<string>("");
  const [valueDiagnosis, setValueDiagnosis] = useState<readonly Option[]>([]);
  
  const { field: selectGender } = useController({ name: "gender", control });
  const { field: selectPhysicalShape } = useController({ name: "physical_shape", control });
  const { field: selectPrognosis } = useController({ name: "prognosis", control });
  const { value: selectPhysicalShapeValue, onChange: selectPhysicalShapeOnChange, ...restSelectPhysicalShape } = selectPhysicalShape;
  const { value: selectGenderValue, onChange: selectGenderOnChange, ...restSelectGender } = selectGender;
  const { value: selectPrognosisValue, onChange: selectPrognosisOnChange, ...restSelectPrognosis } = selectPrognosis;

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
      setPreviewImage(URL.createObjectURL(file))
    }
  };

  const { isLoading, mutate } = useMutation({
    mutationKey: ['create-patient'],
    mutationFn: async (data: registerPatientFormData) => {
      const formData = new FormData();
      formData.append('image', selectedImage)

      if (selectedImage != null || undefined) {
        const upload = await api.post<UploadImageResponse>('uploads/image/', formData)

        await api.post("/patient", {
          ...data, 
          profile_photo: upload.data.imageUrl,
        })
      } else {
        await api.post("/patient", {
          ...data, 
          profile_photo: null,
        })
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
      setSelectedImage(undefined)
      setPreviewImage(null);
      setValueDiagnosis([])
      reset()
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
                      <Avatar.Root
                        className={
                          !previewImage
                            ? "w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center"
                            : "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                        }
                      >
                        {!previewImage ? (
                          <div className="w-4 h-4">
                            <CameraIcon
                              className="w-full h-full object-cover"
                              color="#e5e7eb"
                            />
                          </div>
                        ) : (
                          <Avatar.Image
                            src={previewImage}
                            className="w-full h-full object-cover"
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
              <div className="w-full flex justify-end">
                <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
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
