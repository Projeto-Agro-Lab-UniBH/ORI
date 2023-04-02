import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

export function CreateExam() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title />
        <Dialog.Description />
        <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center border-none rounded-full hover:bg-gray-50">
          <Cross1Icon width={24} height={24} />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
