import * as Dialog from "@radix-ui/react-dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";

const EditExamModal = () => {
  return (
    <Dialog.Root>
      <div className="px-1 py-1 border-none rounded hover:bg-gray-50">
        <Dialog.Trigger className="w-16 flex items-center gap-1 text-brand-standard-black font-semibold">
          <Pencil2Icon /> Editar
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EditExamModal