import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

import Select from "react-select";

import { Label } from "../Label/Label";

export function CreatePatientRecord() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
        <div className="w-full px-6 mb-6 flex items-center flex-row justify-between">
          <Dialog.Title className="font-semibold text-2xl">
            Cadastrar paciente
          </Dialog.Title>
          <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center border-none rounded-full hover:bg-gray-50">
            <Cross1Icon width={24} height={24} />
          </Dialog.Close>
        </div>
        <div
          id="modal-scroll"
          className="w-full h-[488px] px-6 pt-4 pb-6 overflow-y-scroll"
        >
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full h-28 flex items-center gap-4">
              <div className="w-[72px] h-full flex items-center flex-col gap-2">
                <div className="w-full flex items-center justify-center">
                  <span className="text-sm font-normal text-brand-standard-black">
                    Foto
                  </span>
                </div>
                <div className="w-full flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-brand-standard-black rounded-full flex items-center justify-center overflow-hidden"></div>
                  {/* <Avatar.Root className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                    <Avatar.Image
                      className="w-full h-full object-cover"
                      src=""
                    />
                    <Avatar.Fallback />
                  </Avatar.Root> */}
                </div>
              </div>
              <div className="w-full h-full flex">
                <div className="w-full flex justify-center flex-col gap-1">
                  <label
                    htmlFor="patient-photo-file"
                    className="w-full text-base font-normal text-[#4573D2] cursor-pointer"
                  >
                    Selecionar uma foto
                  </label>
                  <input
                    type="file"
                    id="patient-photo-file"
                    name="patientPhotoFile"
                    className="hidden"
                  />
                  <div className="w-full">
                    <div className="w-full flex flex-col items-center">
                      <p className="w-full text-brand-standard-black font-semibold text-sm">
                        Dica:
                      </p>
                      <p className="w-full text-gray-500 font-normal text-sm whitespace-nowrap">
                        Uma foto de perfil do paciente o ajuda a ser reconhecido
                        na plataforma.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form className="w-full h-360 mb-8">
              <div className="w-full flex flex-col gap-6">
                <div className="w-full flex flex-row gap-4">
                  <div className="w-44">
                    <div className="w-44 flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Data de entrada" />
                        <input
                          type="date"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-44">
                    <div className="w-44 flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Data de saída" />
                        <input
                          type="date"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Situação" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                  <div className="w-[368px]">
                    <div className="w-[368px] flex flex-col gap-3">
                      <Label htmlFor="" text="Nome paterno do paciente" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="" text="Nome da espécie / Raça" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                  <div className="w-[368px]">
                    <div className="w-[368px] flex flex-col gap-3">
                      <Label htmlFor="" text="Nome do dono(a)" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Tipo do animal" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-row gap-4">
                  <div className="w-44">
                    <div className="w-44 flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Porte físico" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-44">
                    <div className="w-44 flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Peso" />
                        <input
                          type="text"
                          className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-col gap-6">
                      <div className="w-full flex flex-col gap-3">
                        <Label htmlFor="" text="Gênero do animal" />
                        <Select
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              width: "100%",
                              height: 40,
                              borderColor: state.isFocused
                                ? "#e2e8f0"
                                : "#e2e8f0",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              fontFamily: "Inter",
                              fontWeight: 400,
                              fontSize: "0.875rem",
                              lineHeight: "1.25rem",
                            }),
                          }}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 4,
                            colors: {
                              ...theme.colors,
                              primary75: "#cbd5e1",
                              primary50: "##e2e8f0",
                              primary25: "#f8fafc",
                              primary: "#212529",
                            },
                          })}
                          placeholder="Selecione o sexo do paciente"
                          isSearchable={false}
                          options={[
                            { value: "Macho", label: "Macho" },
                            { value: "Fêmea", label: "Fêmea" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-5">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="" text="Diagnóstico" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="w-full flex justify-end">
              <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
