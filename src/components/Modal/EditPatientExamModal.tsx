import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, Pencil2Icon } from "@radix-ui/react-icons";

const EditPatientExamModal = () => {
  return (
    <Dialog.Root>
      <div className="px-1 py-1 border-none rounded hover:bg-gray-50">
        <Dialog.Trigger className="w-16 flex items-center gap-1 text-brand-standard-black font-semibold">
          <Pencil2Icon /> Editar
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Editar exame
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          <div id="modal-scroll" className="w-full px-6 pt-6 pb-6">
            <form className="w-full flex flex-col h-360">
              <div className="w-full flex flex-col gap-6">
                <div className="w-[224px]">
                  <div className="w-[224px] flex flex-col gap-3">
                    <label htmlFor="" className="w-full text-sm font-normal text-brand-standard-black">Tipo de exame</label>
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-row gap-3">
                  <div className="w-[224px]">
                    <div className="w-[224px] flex flex-col gap-3">
                      <label htmlFor="" className="w-full text-sm font-normal text-brand-standard-black">Data de realização</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      />
                    </div>
                  </div>
                  <div className="w-[322.4px]">
                    <div className="w-[322.4px] flex flex-col gap-3">
                      <label htmlFor="" className="w-full text-sm font-normal text-brand-standard-black">Nome do responsável</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <label htmlFor="annotations" className="w-full text-sm font-normal text-brand-standard-black">Anotações</label>
                  <div>
                    <textarea
                      cols={30}
                      rows={6}
                      className="w-full px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <div className="w-[558.4px] flex items-center">
                    <p className="w-[558.4px] max-w-[500px] whitespace-nowrap overflow-hidden text-ellipsis text-sm font-normal text-brand-standard-black">
                      
                    </p>
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-full flex">
                      <label
                        htmlFor="patient-photo-file"
                        className="border border-gray-200 flex items-center px-3 py-[6px] gap-1 rounded text-base text-brand-standard-black font-medium bg-white hover:border-[#b3b3b3] cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#212529"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                          />
                        </svg>
                        Adicionar um anexo
                      </label>
                      <input
                        type="file"
                        accept=".doc, .docx, .pdf"
                        id="patient-photo-file"
                        className="hidden"
                      />
                    </div>
                    <div className="w-full flex justify-end">
                      <button type="submit" className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EditPatientExamModal