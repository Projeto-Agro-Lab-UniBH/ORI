import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Cross1Icon } from "@radix-ui/react-icons";

import { PersonIcon } from "@radix-ui/react-icons";
import * as Avatar from "@radix-ui/react-avatar";

import Select from "react-select";

import { Label } from "../Label/Label";

const countries = [
  { value: "AC", label: "AC - Acre" },
  { value: "AL", label: "AL - Alagoas" },
  { value: "AP", label: "AP - Amapá" },
  { value: "AM", label: "AM - Amazônia" },
  { value: "BA", label: "BA - Bahia" },
  { value: "CE", label: "CE - Ceará" },
  { value: "ES", label: "ES - Espírito Santo" },
  { value: "GO", label: "GO - Goiás" },
  { value: "MA", label: "MA - Maranhão" },
  { value: "MT", label: "MT - Mato Grosso" },
  { value: "MS", label: "MS - Mato Grosso do Sul" },
  { value: "MG", label: "MG - Minas Gerais" },
  { value: "PA", label: "PA - Pará" },
  { value: "PB", label: "PB - Paraíba" },
  { value: "PR", label: "PR - Paraná" },
  { value: "PE", label: "PE - Pernambuco" },
  { value: "PI", label: "PI - Piauí" },
  { value: "RJ", label: "RJ - Rio de Janeiro" },
  { value: "RN", label: "RN - Rio Grande do Norte" },
  { value: "RS", label: "RN - Rio Grande do Sul" },
  { value: "RO", label: "RO - Rondônia" },
  { value: "SC", label: "SC - Santa Catarina" },
  { value: "SP", label: "SP - São Paulo" },
  { value: "SE", label: "SE - Sergipe" },
  { value: "TO", label: "TO - Tocantins" },
];

export function EditUserProfileData() {
  return (
    <Tabs.Root defaultValue="profile">
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
        <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
          <div className="w-full px-6 mb-6 flex items-center flex-row justify-between">
            <Dialog.Title className="font-semibold text-2xl">
              Editar dados do seu perfil
            </Dialog.Title>
            <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center border-none rounded-full hover:bg-gray-50">
              <Cross1Icon width={24} height={24} />
            </Dialog.Close>
          </div>
          <div className="w-full">
            <Tabs.List>
              <Tabs.List className="w-full h-10 pl-6 flex flex-wrap -mb-px text-sm font-medium text-center border-b border-gray-200">
                <Tabs.Trigger
                  value="profile"
                  id="button-tab"
                  className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Perfil
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.List>
            <Tabs.Content value="profile">
              <div className="w-full h-[484px] px-6 py-6 overflow-y-scroll">
                <div className="w-full h-full flex flex-col items-center gap-10 mb-4">
                  <div className="w-full h-[96px] flex items-center gap-4">
                    <div className="w-[72px] h-full flex items-center flex-col gap-2">
                      <div className="w-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-brand-standard-black">
                          Foto
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <Avatar.Root className="w-16 h-16 border-brand-standard-black border-2 rounded-full flex items-center justify-center overflow-hidden">
                          <PersonIcon width={20} height={20} color="#212529" />
                          <Avatar.Image
                            className="w-full h-full object-cover"
                            src="/photo-person.jpg"
                          />
                          <Avatar.Fallback />
                        </Avatar.Root>
                      </div>
                    </div>
                    <div className="w-full h-full flex">
                      <div className="w-full flex justify-end flex-col gap-1">
                        <a
                          className="w-full text-base font-normal text-[#4573D2]"
                          href=""
                        >
                          Selecionar uma foto
                        </a>
                        <div className="w-full">
                          <div className="w-full flex flex-col items-center">
                            <p className="w-full text-brand-standard-black font-semibold text-sm">
                              Dica:
                            </p>
                            <p className="w-full text-gray-500 font-normal text-sm whitespace-nowrap">
                              Uma foto de perfil do paciente o ajuda a ser
                              reconhecido na plataforma.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="w-full">
                    <div className="w-full flex flex-col gap-6">
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-[368px]">
                          <div className="w-[368px] flex flex-col gap-3">
                            <Label htmlFor="" text="Nome completo" />
                            <input
                              type="text"
                              className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-3">
                            <Label htmlFor="" text="Registro Acadêmico" />
                            <input
                              type="text"
                              className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-44">
                          <div className="w-44 flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                              <Label htmlFor="" text="Data de nascimento" />
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
                              <Label htmlFor="" text="Estado" />
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
                                placeholder="Selecione estado"
                                isSearchable={false}
                                options={countries}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-6">
                            <div className="w-full flex flex-col gap-3">
                              <Label htmlFor="" text="Nome do Campus" />
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
                                placeholder="Selecione o campus"
                                isSearchable={false}
                                options={[{ value: "UniBH", label: "UniBH" }]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row gap-4">
                        <div className="w-[368px]">
                          <div className="w-[368px] flex flex-col gap-3">
                            <Label htmlFor="" text="E-mail" />
                            <input
                              type="text"
                              className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-3">
                            <Label htmlFor="" text="Telefone Celular" />
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
                            <Label htmlFor="" text="Perfil Profissional" />
                            <input
                              type="text"
                              className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="w-full flex flex-col gap-3">
                            <Label htmlFor="" text="Telefone Fixo" />
                            <input
                              type="text"
                              className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="w-full flex justify-end pb-6">
                    <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                      Salvar alterações
                    </button>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Tabs.Root>
  );
}
