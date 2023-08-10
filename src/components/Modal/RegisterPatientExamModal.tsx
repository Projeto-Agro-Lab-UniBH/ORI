import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon, UploadIcon } from "@radix-ui/react-icons";

/**
 * Tarefas para este componente:
 * [] Implementar o formulário.
 * [] Implementar o input drag and drop de arquivos.
 * [] Implementar integração com o back-end.
 */

const RegisterPatientExamModal = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
        Registrar novo exame
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20" />
        <Dialog.Content className="w-[608px] rounded-lg border border-gray-200 bg-white fixed overflow-hidden pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Registrar novo exame
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          <div 
            id="modal-scroll" 
            className="w-full h-[402px] px-6 py-6 overflow-y-scroll"
          >
            <form className="w-full flex flex-col h-360">
              <div className="w-full flex flex-col gap-6">
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
                </div>
                <div className="w-full flex flex-row gap-3">
                  <div className="w-[224px]">
                    <div className="w-[224px] flex flex-col gap-3">
                      <label htmlFor="" className="w-full text-sm font-normal text-brand-standard-black">Tipo de exame</label>
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      />
                    </div>
                  </div>
                  <div className="w-[316.8px]">
                    <div className="w-[316.8px] flex flex-col gap-3">
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
                  <div className="max-w-xl">
                    <label
                      className="flex justify-center w-full h-24 px-4 transition bg-white border border-gray-200 border-dashed rounded-md appearance-none cursor-pointer hover:border-[#b3b3b3] focus:outline-none"
                    >
                      <span className="flex items-center space-x-2">
                        <UploadIcon width={20} height={20} />
                        <span className="font-medium text-gray-600">
                          Pegue e arraste os arquivos para anexar aqui
                        </span>
                      </span>
                      <input 
                        type="file" 
                        multiple
                        accept=".doc, .docx, .pdf"
                        id="patient-photo-file" 
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <div className="w-full flex justify-end">
                    <button type="submit" className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RegisterPatientExamModal;
