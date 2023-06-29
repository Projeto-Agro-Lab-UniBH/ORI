import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Cross1Icon } from "@radix-ui/react-icons";
import PatientProfileTabContent from "../TabContent/PatientProfileTabContent";
import PatientReportsTabContent from "../TabContent/PatientReportsTabContent";
import PatientExamsTabContent from "../TabContent/PatientExamsTabContent";
import PatientAttachmentsTabContent from "../TabContent/PatientAttachmentsTabContent";
import { useState } from "react";

type EditPatientModalProps = {
  patientId: string;
	children: React.ReactNode;
}

const EditPatientModal = (props: EditPatientModalProps) => {
  const [open, setOpen] = useState<boolean>(false);

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
								<PatientProfileTabContent patientId={props.patientId} isOpen={open} />
              </Tabs.Content>
              <Tabs.Content value="reports">
                <PatientReportsTabContent patientId={props.patientId} isOpen={open} />
              </Tabs.Content>
              <Tabs.Content value="exams">
                <PatientExamsTabContent patientId={props.patientId} isOpen={open} />
              </Tabs.Content>
              <Tabs.Content value="attachments">
                <PatientAttachmentsTabContent patiendId={props.patientId} isOpen={open} />
              </Tabs.Content>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Tabs.Root>
  );
};

export default EditPatientModal;
