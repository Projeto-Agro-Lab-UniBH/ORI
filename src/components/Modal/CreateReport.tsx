import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

import { Label } from "../Label/Label";

export function CreateReport() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
        <div className="w-full px-6 mb-6 flex items-center flex-row justify-between">
          <Dialog.Title className="font-semibold text-2xl">
            Criar um novo relatório
          </Dialog.Title>
          <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center border-none rounded-full hover:bg-gray-50">
            <Cross1Icon width={24} height={24} />
          </Dialog.Close>
        </div>
        <div className="w-full px-6 py-6">
          <form className="w-full h-360 mb-8">
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col gap-3">
                <Label htmlFor="" text="Título do relatório" />
                <input
                  type="text"
                  className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                <Label htmlFor="" text="Texto" />
                <textarea
                  name=""
                  id=""
                  cols={30}
                  rows={10}
                  className="w-full px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                ></textarea>
              </div>
            </div>
          </form>
          <div className="w-full flex justify-end">
            <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
              Salvar alterações
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
