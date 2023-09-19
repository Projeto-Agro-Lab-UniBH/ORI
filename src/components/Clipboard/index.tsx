import * as Avatar from "@radix-ui/react-avatar";
import * as Collapsible from '@radix-ui/react-collapsible';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon, Cross2Icon, DashIcon, PlusIcon } from "@radix-ui/react-icons";
import { api } from "../../providers/Api";
import { useQuery } from "react-query";
import { GetPatientClipboardResponse } from "../../@types/ApiResponse";
import EditPatientModal from "../Modal/EditPatientModal";
import VerticalScrollbar from "../Scrollbar/VerticalScrollbar";

type PatientClipboardProps = {
  patientId: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const PatientClipboard: React.FC<PatientClipboardProps> = ({
  patientId,
  children,
  open,
  setOpen,
}) => {
  const [openHospitalizationsSection, setOpenHospitalizationsSection] = useState<boolean>(false);
  const [openReportSection, setOpenReportSection] = useState<boolean>(false);
  const [openExamsSection, setOpenExamsSection] = useState<boolean>(false);
  const [openFilesSection, setOpenFilesSection] = useState<boolean>(false);
  const [callRequest, setCallRequest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data } = useQuery<GetPatientClipboardResponse>({
    queryKey: ["get-all-data-patient-by-id"],
    queryFn: async () => {
      setIsLoading(true);
      const response = await api.get<GetPatientClipboardResponse>(
        `/patient/${patientId}`
      );
      setIsLoading(false);
      return response.data;
    },
    enabled: callRequest,
  });

  useEffect(() => {
    if (open === true) {
      setCallRequest(true);
    } else {
      setCallRequest(false);
    }
  }, [open, setCallRequest]);

  return (
    <>
      <button onClick={() => setOpen(true)}>{children}</button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <Cross2Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <VerticalScrollbar
                      styleViewportArea="h-screen rounded-l-lg bg-white shadow-xl"
                    >
                      <div className="w-full flex flex-col gap-3 py-3 px-3">
                        <div className="w-full flex flex-col gap-3 px-3 py-3 border border-gray-200 rounded-lg">
                          <div className="w-full flex flex-row items-center justify-end gap-4">
                            <div className="w-full">
                              <span className="text-ellipsis text-lg text-shark-950 font-semibold overflow-hidden">
                                Ficha completa do paciente
                              </span>
                            </div>
                            <div className="flex justify-center items-center">
                              <EditPatientModal patientId={data?.id as string} />
                            </div>
                          </div>
                          <div className="w-full flex flex-row items-center gap-4">
                            <div className="w-12 h-12">
                              <Avatar.Root className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
                                <Avatar.Image
                                  src={data?.profile_photo}
                                  className="w-full h-full object-cover"
                                />
                                <Avatar.Fallback
                                  className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full overflow-hidden"
                                  delayMs={600}
                                >
                                  <CameraIcon
                                    width={12}
                                    height={12}
                                    color="#e5e7eb"
                                  />
                                </Avatar.Fallback>
                              </Avatar.Root>
                            </div>
                            <div className="w-full flex flex-col">
                              <span className="text-xs font-base text-shark-950">
                                Nome do paciente:
                              </span>
                              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[208px] text-xl font-semibold text-shark-950">
                                {data && data.name}
                              </span>
                            </div>
                          </div>
                          {data && data.specie && (
                            <div className="w-full flex flex-col">
                              <span className="text-xs font-base text-shark-950">
                                Espécie:
                              </span>
                              <span className="whitespace-normal overflow-hidden max-w-[402px] text-base font-semibold text-shark-950">
                                {data?.specie}
                              </span>
                            </div>
                          )}
                          {data && data.race && (
                            <div className="w-full flex flex-col">
                              <span className="text-xs font-base text-shark-950">
                                Raça:
                              </span>
                              <span className="whitespace-normal overflow-hidden max-w-[402px] text-base font-semibold text-shark-950">
                                {data && data.race}
                              </span>
                            </div>
                          )}
                          <div className="w-full flex flex-row gap-8">
                            <div className="w-24 flex flex-col">
                              <span className="text-xs font-base text-shark-950">
                                Gênero:
                              </span>
                              <span className="text-base font-semibold text-shark-950">
                                {data && data.gender}
                              </span>
                            </div>
                            <div className="w-[128px]  flex flex-col">
                              <span className="text-xs font-base text-shark-950">
                                Porte físico:
                              </span>
                              <span className="text-base font-semibold text-shark-950">
                                {data && data.physical_shape}
                              </span>
                            </div>
                            <div className="w-24 flex flex-col">
                              <span className="text-xs font-base text-shark-950">
                                Peso:
                              </span>
                              <span className="text-base font-semibold text-shark-950">
                                {data && data.weight}
                              </span>
                            </div>
                          </div>
                          <div className="w-full flex flex-col">
                            <span className="text-xs font-base text-shark-950">
                              Nome do tutor(a):
                            </span>
                            <span className="whitespace-normal overflow-hidden max-w-[402px] text-base font-semibold text-shark-950">
                              {(data && data.owner) || "Não identificado"}
                            </span>
                          </div>
                        </div>
                        <Collapsible.Root
                          open={openHospitalizationsSection}
                          onOpenChange={setOpenHospitalizationsSection}
                          className="w-full flex flex-col gap-3 px-3 py-3 border border-gray-200 rounded-lg"
                        >
                          <div className="w-full flex justify-between items-center">
                            <span className="w-[87.61px] text-lg text-shark-950 font-semibold">
                              Internações
                            </span>
                            <Collapsible.Trigger asChild>
                              <button className="w-8 h-8 flex justify-center items-center rounded hover:border hover:border-gray-200">
                                {openHospitalizationsSection ? (
                                  <DashIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                ) : (
                                  <PlusIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                )}
                              </button>
                            </Collapsible.Trigger>
                          </div>
                          <Collapsible.Content></Collapsible.Content>
                        </Collapsible.Root>
                        <Collapsible.Root
                          open={openReportSection}
                          onOpenChange={setOpenReportSection}
                          className="w-full flex flex-col gap-3 px-3 py-3 border border-gray-200 rounded-lg"
                        >
                          <div className="w-full flex justify-between items-center">
                            <span className="w-[87.61px] text-lg text-shark-950 font-semibold">
                              Relatórios
                            </span>
                            <Collapsible.Trigger asChild>
                              <button className="w-8 h-8 flex justify-center items-center rounded hover:border hover:border-gray-200">
                                {openReportSection ? (
                                  <DashIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                ) : (
                                  <PlusIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                )}
                              </button>
                            </Collapsible.Trigger>
                          </div>
                          <Collapsible.Content></Collapsible.Content>
                        </Collapsible.Root>
                        <Collapsible.Root
                          open={openExamsSection}
                          onOpenChange={setOpenExamsSection}
                          className="w-full flex flex-col gap-3 px-3 py-3 border border-gray-200 rounded-lg"
                        >
                          <div className="w-full flex justify-between items-center">
                            <span className="w-[68.09px] text-lg text-shark-950 font-semibold">
                              Exames
                            </span>
                            <Collapsible.Trigger asChild>
                              <button className="w-8 h-8 flex justify-center items-center rounded hover:border hover:border-gray-200">
                                {openExamsSection ? (
                                  <DashIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                ) : (
                                  <PlusIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                )}
                              </button>
                            </Collapsible.Trigger>
                          </div>
                          <Collapsible.Content></Collapsible.Content>
                        </Collapsible.Root>
                        <Collapsible.Root
                          open={openFilesSection}
                          onOpenChange={setOpenFilesSection}
                          className="w-full flex flex-col gap-3 px-3 py-3 border border-gray-200 rounded-lg"
                        >
                          <div className="w-full flex justify-between items-center">
                            <span className="w-[68.09px] text-lg text-shark-950 font-semibold">
                              Anexos
                            </span>
                            <Collapsible.Trigger asChild>
                              <button className="w-8 h-8 flex justify-center items-center rounded hover:border hover:border-gray-200">
                                {openFilesSection ? (
                                  <DashIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                ) : (
                                  <PlusIcon
                                    color="#212529"
                                    width={16}
                                    height={16}
                                  />
                                )}
                              </button>
                            </Collapsible.Trigger>
                          </div>
                          <Collapsible.Content></Collapsible.Content>
                        </Collapsible.Root>
                      </div>
                    </VerticalScrollbar>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default PatientClipboard;
