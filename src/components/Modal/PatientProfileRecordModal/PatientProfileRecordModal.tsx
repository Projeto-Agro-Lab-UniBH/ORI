import * as Dialog from "@radix-ui/react-dialog";
import PatientRecordModalContent from "./PatientRecordContent/PatientRecordContent";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

type EditPatientProfileModalProps = {
  patientId: string;
  children: React.ReactNode;
};

const PatientProfileRecordModal: React.FC<EditPatientProfileModalProps> = ({ patientId, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
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
          <PatientRecordModalContent 
            patientId={patientId} 
            modalIsOpen={open} 
          />    
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PatientProfileRecordModal;
