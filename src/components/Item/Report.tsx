import * as Dialog from "@radix-ui/react-dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";

export function Report() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full flex flex-col items-center gap-6 pb-6 border-b border-gray-200">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-[504px] items-center flex">
              <span className="w-[504px] whitespace-nowrap text-2xl text-brand-standard-black font-semibold overflow-hidden text-ellipsis">
                Lorem ipsum
              </span>
            </div>
            <Dialog.Root>
              <div className="px-1 py-1 border-none rounded hover:bg-gray-50">
                <Dialog.Trigger className="w-16 flex items-center gap-1 text-brand-standard-black font-semibold">
                  <Pencil2Icon /> Editar
                </Dialog.Trigger>
              </div>
            </Dialog.Root>
          </div>
          <div className="w-full flex items-center gap-1">
            <span className="text-sm text-brand-standard-black font-semibold">
              ID:
            </span>
            <p className="text-base font-normal text-brand-standard-black">
              7a6401c5-e894-4da9-9b66-9ab7ce4d0a08
            </p>
          </div>
          <div className="w-full flex-row flex items-center gap-5">
            <div className="flex items-center gap-1">
              <span className="text-sm text-brand-standard-black font-semibold">
                Data de criação:
              </span>
              <p className="text-base font-normal text-brand-standard-black">
                00/00/00
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-brand-standard-black font-semibold">
                Data da última edição:
              </span>
              <p className="text-base font-normal text-brand-standard-black">
                00/00/00
              </p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <p className="text-base font-normal text-brand-standard-black">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            fermentum rutrum ipsum eget aliquam. Curabitur gravida, tellus quis
            convallis pretium, dolor felis dignissim mauris, vitae feugiat nunc
            arcu quis orci.
          </p>
        </div>
      </div>
    </div>
  );
}
