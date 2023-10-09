import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { useMutation, useQuery } from "react-query";
import { CameraIcon, Cross1Icon } from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "../../../providers/Api";
import { queryClient } from "../../../providers/QueryClient";
import { GetPatientResponse, PatchPatientResponse, UploadImageResponse } from "../../../@types/ApiResponse";
import { editPatientProfileFormData, editPatientProfileFormSchema } from "../../../schemas/editPatientProfileFormSchema";
import { Option } from "../../../interfaces/Option";
import { Reports } from "../../../@types/reports";
import { Patient } from "../../../@types/patient";
import { Exams } from "../../../@types/exams";
import { Surgery } from "../../../@types/surgery";
import { Vaccine } from "../../../@types/vaccine";
import { Hospitalizations } from "../../../@types/hospitalizations";

import SpinnerLoad from "../../Shared/Loads/SpinnerLoad";
import SelectInput from "../../Shared/SelectInput";
import ReportItem from "../../Items/ReportItem";
import ExamItem from "../../Items/ExamItem";
import HospitalizationItem from "../../Items/HospitalizationItem";
import SurgeryItem from "../../Items/SurgeryItem";
import VaccineItem from "../../Items/VaccineItem";
import RegisterPatientExamModal from "../RegisterPatientExamModal";
import RegisterPatientHospitalizationModal from "../RegisterPatientHospitalization";
import RegisterPatientReportModal from "../RegisterPatientReportModal";
import RegisterPatientSurgeryModal from "../RegisterPatientSurgeryModal";
import RegisterPatientVaccinesModal from "../RegisterPatientVaccinesModal";
import LittleSpinnerLoad from "../../Shared/Loads/LittleSpinnerLoad";

const PatientProfileRecordModal = ({ patientId, children }: { patientId: string; children: React.ReactNode; }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patientFormData, setPatientFormData] = useState<Patient | undefined>(undefined);
  const [exams, setExams] = useState<Exams[] | undefined>(undefined);
  const [surgery, setSurgery] = useState<Surgery[] | undefined>(undefined);
  const [vaccines, setVaccines] = useState<Vaccine[] | undefined>(undefined);
  const [reports, setReports] = useState<Reports[] | undefined>(undefined);
  const [hospitalizations, setHospitalizations] = useState<Hospitalizations[] | undefined>(undefined)

  useEffect(() => {
    if (open != true) {
      setCallRequest(false);
    } else {
      setCallRequest(true);
    }
  }, [open, setCallRequest]);

  useQuery({
    queryKey: ["get-patient-by-id"],
    queryFn: async () => {
      setIsLoading(true);
      await api.get<GetPatientResponse>(`/patient/${patientId}`).then((res) => {
        setPatientFormData(res.data as Patient);
        setExams(res.data.exams);
        setReports(res.data.reports);
        setHospitalizations(res.data.hospitalizations);
        setSurgery(res.data.surgery);
        setVaccines(res.data.vaccines)
      });
      setIsLoading(false);
    },
    enabled: callRequest,
  });

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-10" />
        <Dialog.Content className="w-[720px] rounded-lg border-none bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-full px-6 mb-6 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl text-slate-700">
              Ficha do paciente
            </Dialog.Title>
            <Dialog.Close className="h-8 bg-transparent flex justify-center items-center">
              <Cross1Icon className="text-slate-400 hover:text-slate-500" width={24} height={24} />
            </Dialog.Close>
          </div>
          <Tabs.Root defaultValue="profile">
            <div className="w-full">
              <Tabs.List className="w-full h-10 pl-6 flex flex-wrap -mb-px text-sm font-medium text-center border-b border-slate-300">
                <Tabs.Trigger
                  value="profile"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-gray-500 hover:border-slate-400 data-[state=active]:text-slate-700 data-[state=active]:border-b-slate-700 focus:outline-none"
                >
                  Perfil
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="vaccines"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-gray-500 hover:border-slate-400 data-[state=active]:text-slate-700 data-[state=active]:border-b-slate-700 focus:outline-none"
                >
                  Vacinas
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="exams"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-gray-500 hover:border-slate-400 data-[state=active]:text-slate-700 data-[state=active]:border-b-slate-700 focus:outline-none"
                >
                  Exames
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="surgery"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-gray-500 hover:border-slate-400 data-[state=active]:text-slate-700 data-[state=active]:border-b-slate-700 focus:outline-none"
                >
                  Cirurgias
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="hospitalizations"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-gray-500 hover:border-slate-400 data-[state=active]:text-slate-700 data-[state=active]:border-b-slate-700 focus:outline-none"
                >
                  Internações
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="reports"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-slate-400 hover:text-gray-500 hover:border-slate-400 data-[state=active]:text-slate-700 data-[state=active]:border-b-slate-700"
                >
                  Relatórios
                </Tabs.Trigger>
              </Tabs.List>
              <TabContentProfile 
                isOpen={open} 
                patientId={patientId}
                isLoading={isLoading}
                data={patientFormData} 
              />
              <TabContentVaccines 
                patientId={patientId}
                isLoading={isLoading}
                data={vaccines}
              />
              <TabContentExam 
                patientId={patientId}
                isLoading={isLoading}
                data={exams} 
              />
              <TabContentSurgery 
                patientId={patientId}
                data={surgery}
                isLoading={isLoading} 
              />
              <TabContentHospitalizations
                patientId={patientId}
                isLoading={isLoading}
                data={hospitalizations} 
              />
              <TabContentReports
                patientId={patientId} 
                isLoading={isLoading}
                data={reports} 
              />
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const TabContentProfile = ({
  isOpen,
  patientId,
  isLoading,
  data,
}: {
  isOpen: boolean;
  patientId: string;
  isLoading: boolean;
  data: Patient | undefined;
}) => {
  const { reset, register, watch, handleSubmit, control, formState: { errors },
  } = useForm<editPatientProfileFormData>({
    resolver: zodResolver(editPatientProfileFormSchema),
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fetchedImage, setFetchedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);

  const { field: selectPhysicalShape } = useController({ name: "physical_shape", control });
  const { value: selectPhysicalShapeValue, onChange: selectPhysicalShapeOnChange, ...restSelectPhysicalShape } = selectPhysicalShape;

  const { field: selectGender } = useController({ name: "gender", control });
  const { value: selectGenderValue, onChange: selectGenderOnChange, ...restSelectGender } = selectGender;

  const { field: selectStatus } = useController({ name: "status", control });
  const { value: selectStatusValue, onChange: selectStatusOnChange, ...restSelectStatus } = selectStatus;

  const genderOptions: Option[] = [
    { label: "Macho", value: "Macho" },
    { label: "Fêmea", value: "Fêmea" },
  ];

  const physicalShapeOptions: Option[] = [
    { label: "Grande porte", value: "Grande porte" },
    { label: "Médio porte", value: "Médio porte" },
    { label: "Pequeno porte", value: "Pequeno porte" },
  ];

  const patientStatusOptions: Option[] = [
    { label: "Vivo", value: "Vivo" },
    { label: "Favorável", value: "Favorável" },
    { label: "Risco", value: "Risco" },
    { label: "Alto risco", value: "Alto risco" },
  ]

  useEffect(() => {
    if (isOpen && data) {
      reset(data);
      setFetchedImage(data.profile_photo as string | null);
    }
  }, [isOpen, data, reset, setFetchedImage]);

  useEffect(() => {
    if (isOpen != true) {
      setPreviewImage(null);
      setPhoto(null);
      reset();
    }
  }, [isOpen, setPhoto, reset]);

  useEffect(() => {
    if (fetchedImage) {
      setPhoto(fetchedImage);
    }
    if (previewImage) {
      setPhoto(previewImage);
    }
  }, [photo, setPhoto, fetchedImage, previewImage]);

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { isLoading: isUpdating, mutate } = useMutation({
    mutationKey: ["update-patient"],
    mutationFn: async (data: editPatientProfileFormData) => {
      if (selectedImage !== undefined) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const upload = await api.post<UploadImageResponse>(
          "uploads/image/",
          formData
        );

        await api.patch<PatchPatientResponse>(`/patient/${patientId}`, {
          ...data,
          profile_photo: upload.data.imageUrl,
        });
      } else {
        await api.patch<PatchPatientResponse>(`/patient/${patientId}`, {
          ...data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  const onSubmit = (data: editPatientProfileFormData) => {
    mutate(data);
  };

  return (
    <Tabs.Content value="profile">
      {(isLoading) && (
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
      <ScrollArea.Root className="w-full h-[488px] overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full px-6 py-6">
          <form
            className="w-full flex flex-col gap-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center gap-4">
                  <div className="w-[72px] flex items-center flex-col gap-2">
                    <div className="w-full flex items-center justify-center">
                      <span className="font-medium text-sm text-slate-700">
                        Foto
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center">
                      <Avatar.Root className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden">
                        <Avatar.Image
                          src={photo as string | undefined}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <Avatar.Fallback
                          className="w-16 h-16 border border-slate-300 flex items-center justify-center rounded-full overflow-hidden"
                          delayMs={600}
                        >
                          <CameraIcon width={16} height={16} color="#cbd5e1" />
                        </Avatar.Fallback>
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
              </div>
              <div className="w-full flex flex-row gap-4">
                <div className="w-44">
                  <div className="w-44 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="date_of_birth"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Data de nascimento
                      </label>
                      <input
                        type="date"
                        className="w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...register("date_of_birth")}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-44">
                  <div className="w-44 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="age"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Idade
                      </label>
                      <input
                        type="text"
                        className="w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...register("age")}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="pedigree_RGA"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Nº do Pedigree/RGA
                      </label>
                      <input
                        type="text"
                        className="w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...register("pedigree_RGA")}
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
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Nome 
                      </label>
                      <input
                        type="text"
                        className={`w-full block p-2.5 font-normal text-sm text-shark-950 bg-white rounded-lg border ${
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
                        htmlFor="chip_number"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Nº do chip
                      </label>
                      <input
                        type="text"
                        className="w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...register("chip_number")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-4">
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
                          className="w-full h-[41.6px] text-slate-200 bg-slate-200 border border-slate-300 rounded-lg cursor-not-allowed"
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          className={`w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border ${
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
                          className="w-full h-[41.6px] text-slate-200 bg-slate-200 border border-slate-300 rounded-lg cursor-not-allowed"
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          className={`w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border ${
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
                <div className="w-[128px]">
                  <div className="w-[128px] flex flex-col gap-6">
                    <div className="w-[128px] flex flex-col gap-3">
                      <label
                        htmlFor="starting_weight"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Peso inícial
                      </label>
                      <input
                        type="text"
                        className="w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...register("starting_weight")}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-[128px]">
                  <div className="w-[128px] flex flex-col gap-6">
                    <div className="w-[128px] flex flex-col gap-3">
                      <label
                        htmlFor="current_weight"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Peso atual
                      </label>
                      <input
                        type="text"
                        className="w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                        {...register("current_weight")}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-44">
                  <div className="w-44">
                    <div className="w-44 flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <label
                          htmlFor="physical_shape"
                          className="w-full font-medium text-sm text-slate-700"
                        >
                          Porte físico
                        </label>
                        <SelectInput 
                          placeholder={"Selecione o porte"} 
                          isClearable={false}
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
                          )}
                          {...restSelectPhysicalShape}
                        />
                      </div>
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
                        Sexo
                      </label>
                      <SelectInput 
                        placeholder={"Selecione o sexo"} 
                        isClearable={false}
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
              <div className="w-full flex flex-row gap-4">
                <div className="w-[272px]"> 
                  <div className="w-[272px] flex flex-col gap-2">
                    <div className="w-[272px] flex flex-col gap-3">
                      <label
                        htmlFor="status"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Status
                      </label>
                      <SelectInput 
                        placeholder={"Selecione o status do paciente"} 
                        isClearable={false}
                        isSearchable={false}
                        options={patientStatusOptions} 
                        value={
                          selectStatusValue
                            ? patientStatusOptions.find(
                                (x) => x.value === selectStatusValue
                              )
                            : selectStatusValue
                        }
                        onChange={(option) =>
                          selectStatusOnChange(
                            option ? option.value : option
                          )
                        }
                        {...restSelectStatus}
                      />
                    </div>      
                  </div>        
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col gap-3">
                      <label
                        htmlFor="owner"
                        className="w-full font-medium text-sm text-slate-700"
                      >
                        Nome do proprietário(a)
                      </label>
                      {watch("ownerless_patient") == true ? (
                        <input
                          type="text"
                          className="w-full h-[41.6px] text-slate-200 bg-slate-200 border border-slate-300 rounded-lg cursor-not-allowed"
                          disabled
                        />
                      ) : (
                        <input
                          type="text"
                          className={`w-full block p-2.5 text-sm text-shark-950 font-normal bg-white rounded-lg border ${
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
              </div>
              <div className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col gap-3">
                  <label
                    htmlFor="notes"
                    className="w-full font-medium text-sm text-slate-700"
                  >
                    Observações
                  </label>
                  <textarea
                    rows={10}
                    placeholder="Relate um ponto interessante sobre o animal"
                    className={`resize-none block w-full rounded-lg border-0 p-[12px] text-sm text-slate-900 ring-1 ring-inset ${
                      errors.notes
                        ? "ring-red-300 placeholder:text-red-400 focus:outline-red-500 focus:ring-1 focus:ring-inset focus:ring-red-500"
                        : "ring-slate-300 placeholder:text-slate-400 focus:outline-slate-500 focus:ring-1 focus:ring-inset focus:ring-slate-500"
                    }`}
                    {...register("notes")}
                  />
                </div>
                {errors.notes && (
                  <span className="font-normal text-xs text-red-400">
                    {errors.notes.message}
                  </span>
                )}         
              </div>
            </div>
            <div className="w-full h-10 flex items-center justify-end">
              <button
                type="submit"
                className="w-[152px] h-10 flex justify-center items-center rounded-lg font-medium text-base text-neutral-50 bg-blue-500 hover:bg-blue-600"
                disabled={isUpdating}  
              >
                {isUpdating ? <LittleSpinnerLoad /> : "Salvar alterações"}
              </button>
            </div>
          </form>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
          orientation="vertical"
        >
        <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Tabs.Content>
  );
};

const TabContentVaccines = ({
  patientId,
  isLoading,
  data
}: {
  patientId: string;
  isLoading: boolean;
  data: Vaccine[] | undefined
}) => {
  return (
    <Tabs.Content value="vaccines">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <SpinnerLoad
              divProps={{
                className:
                  "w-full h-[400px] relative flex items-center justify-center bg-slate-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full flex flex-col pb-6 gap-6">
        <ScrollArea.Root className="w-full h-[400px] border-b border-slate-300 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full px-6 py-6">
            <ul role="list" className="divide-y divide-slate-300">
              {data && data.map((data, index) => (
                <li key={index} className="py-6 first:pt-0 last:pb-0">
                  <VaccineItem
                    id={data.id}
                    username={data.username}
                    vaccine={data.vaccine}
                    date_of_vaccination={data.date_of_vaccination}
                    revaccination_date={data.revaccination_date}
                    name_of_veterinarian={data.name_of_veterinarian}
                    vaccine_code={data.vaccine_code}
                    age={data.age}
                    createdAt={data.createdAt}
                    updatedAt={data.updatedAt}
                  />
                </li>
              ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
            orientation="vertical"
            >
            <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientVaccinesModal id={patientId} />
        </div>
      </div>
    </Tabs.Content>
  );
};

const TabContentExam = ({
  patientId,
  isLoading,
  data,
}: {
  patientId: string;
  isLoading: boolean;
  data: Exams[] | undefined;
}) => {
  return (
    <Tabs.Content value="exams">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <SpinnerLoad
              divProps={{
                className:
                  "w-full h-[400px] relative flex items-center justify-center bg-slate-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full flex flex-col pb-6 gap-6">
        <ScrollArea.Root className="w-full h-[400px] border-b border-slate-300 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full px-6 py-6">
            <ul role="list" className="divide-y divide-slate-300">
              {data &&
                data.map((data, index) => (
                  <li key={index} className="py-6 first:pt-0 last:pb-0">
                    <ExamItem
                      id={data.id}
                      username={data.username}
                      execution_date={data.execution_date}
                      runtime={data.runtime}
                      execution_period={data.execution_period}
                      responsible_person={data.responsible_person}
                      type_of_exam={data.type_of_exam}
                      exam_name={data.exam_name}
                      diagnosis={data.diagnosis}
                      prognosis={data.prognosis}
                      description_of_treatment={data.description_of_treatment}
                      createdAt={data.createdAt}
                      updatedAt={data.updatedAt}
                    />
                  </li>
                ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientExamModal patientId={patientId} />
        </div>
      </div>
    </Tabs.Content>
  );
};

const TabContentSurgery = ({
  patientId,
  isLoading,
  data,
}: {
  patientId: string;
  isLoading: boolean;
  data?: Surgery[];
}) => {
  return (
    <Tabs.Content value="surgery">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <SpinnerLoad
              divProps={{
                className:
                  "w-full h-[400px] relative flex items-center justify-center bg-slate-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full flex flex-col pb-6 gap-6">
        <ScrollArea.Root className="w-full h-[400px] border-b border-slate-300 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full px-6 py-6">
            <ul role="list" className="divide-y divide-slate-300">
              {data &&
                data.map((data, index) => (
                  <li key={index} className="py-6 first:pt-0 last:pb-0">
                    <SurgeryItem
                      id={data.id}
                      username={data.username}
                      name_of_surgery={data.name_of_surgery}
                      risk_level={data.risk_level}
                      execution_date={data.execution_date}
                      duration={data.duration}
                      period={data.period}
                      notes={data.notes}
                      createdAt={data.createdAt}
                      updatedAt={data.updatedAt}
                    />
                  </li>
                ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientSurgeryModal patientId={patientId} />
        </div>
      </div>
    </Tabs.Content>
  );
};

const TabContentHospitalizations = ({
  patientId,
  isLoading,
  data,
}: {
  patientId: string;
  isLoading: boolean;
  data: Hospitalizations[] | undefined;
}) => {
  return (
    <Tabs.Content value="hospitalizations">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <SpinnerLoad
              divProps={{
                className:
                  "w-full h-[400px] relative flex items-center justify-center bg-slate-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full flex flex-col pb-6 gap-6">
        <ScrollArea.Root className="w-full h-[400px] border-b border-slate-300 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full px-6 py-6">
            <ul role="list" className="divide-y divide-slate-300">
              {data &&
                data.map((data, index) => (
                  <li key={index} className="py-6 first:pt-0 last:pb-0">
                    <HospitalizationItem
                      id={data.id}
                      username={data.username}
                      reason={data.reason}
                      prognosis={data.prognosis}
                      entry_date={data.entry_date}
                      departure_date={data.departure_date}
                      notes={data.notes}
                      createdAt={data.createdAt}
                      updatedAt={data.updatedAt}
                    />
                  </li>
                ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientHospitalizationModal id={patientId} />
        </div>
      </div>
    </Tabs.Content>
  );
};

const TabContentReports = ({
  patientId,
  isLoading,
  data,
}: {
  patientId: string;
  isLoading: boolean;
  data: Reports[] | undefined;
}) => {

  return (
    <Tabs.Content value="reports">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <SpinnerLoad
              divProps={{
                className:
                  "w-full h-[400px] relative flex items-center justify-center bg-slate-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full flex flex-col pb-6 gap-6">
        <ScrollArea.Root className="w-full h-[400px] border-b border-slate-300 overflow-hidden">
          <ScrollArea.Viewport className="w-full h-full px-6 py-6">
            <ul role="list" className="divide-y divide-slate-300">
              {data &&
                data.map((data, index) => (
                  <li key={index} className="py-6 first:pt-0 last:pb-0">
                    <ReportItem
                      id={data.id}
                      username={data.username}
                      title={data.title}
                      text={data.text}
                      createdAt={data.createdAt}
                      updatedAt={data.updatedAt}
                    />
                  </li>
              ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none bg-slate-100 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-1 hover:bg-slate-200 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-1"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-[#64748b] hover:bg-[#334155] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientReportModal patientId={patientId} />
        </div>
      </div>
    </Tabs.Content>
  );
};

export default PatientProfileRecordModal;