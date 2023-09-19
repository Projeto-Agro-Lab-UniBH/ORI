import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

const RegisterPatientHospitalization = ({ patientId }: { patientId: string; }) => {
  const [open, setOpen] = useState<boolean>(false);
  
  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-[172px] h-10 flex justify-center items-center border border-gray-200 rounded font-medium text-base text-shark-950 bg-white hover:border-none hover:text-neutral-50 hover:bg-blue-500">
        Registrar internação
      </Dialog.Trigger>
      <Dialog.Portal>

      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default RegisterPatientHospitalization;