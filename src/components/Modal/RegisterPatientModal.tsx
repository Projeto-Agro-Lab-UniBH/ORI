import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { Label } from "../Label/Label";
import { Option } from "../../interfaces/Option";
import { useController, useForm } from "react-hook-form";
import { useState, KeyboardEventHandler } from "react";

const createOption = (label: string) => ({
	label,
	value: label,
});

const genderOptions = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Fêmea', label: 'Fêmea' },
]

const physicalShapeOptions = [
  { value: 'Grande porte', label: 'Grande porte' },
  { value: 'Médio porte', label: 'Médio porte' },
  { value: 'Leve porte', label: 'Leve porte' },
]

const situationOptions = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Pronto pra alta', label: 'Pronto pra alta' },
  { value: 'Em observação', label: 'Em observação' },
  { value: 'Risco', label: 'Risco' },
  { value: 'Alto risco', label: 'Alto risco' },
]

export function RegisterPatientModal() {
  const { register, control, handleSubmit } = useForm();
  const { field: selectPhysicalShape } = useController({ name: 'physical_shape', control })
  const { field: selectGender } = useController({ name: 'gender', control })
  const { field: selectSituation } = useController({ name: 'situation', control })
  const { value: selectPhysicalShapeValue, onChange: selectPhysicalShapeOnChange, ...restSelectPhysicalShape } = selectPhysicalShape
  const { value: selectGenderValue, onChange: selectGenderOnChange, ...restSelectGender } = selectGender
  const { value: selectSituationValue, onChange: selectSituationOnChange, ...restSelectSituation } = selectSituation
  const [diagnosisInputValue, setDiagnosisInputValue] = useState('');
	const [valueDiagnosis, setValueDiagnosis] = useState<readonly Option[]>([]);

	const handleKeyDown: KeyboardEventHandler = (event) => {
		if (!diagnosisInputValue) return;
		switch (event.key) {
			case 'Enter':
			case 'Tab':
				setValueDiagnosis((prev) => [...prev, createOption(diagnosisInputValue)]);
				setDiagnosisInputValue('');
				event.preventDefault();
		}
	};
  
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="w-[720px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
        <div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
          <Dialog.Title className="font-semibold text-2xl">
            Cadastrar paciente
          </Dialog.Title>
          <Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
            <Cross1Icon width={24} height={24} />
          </Dialog.Close>
        </div>
        <div
          id="modal-scroll"
          className="w-full h-[488px] px-6 pt-6 pb-6 overflow-y-scroll"
        >
          <form className="w-full flex flex-col gap-10">
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex items-center gap-4">
                <div className="w-[72px] h-full flex items-center flex-col gap-2">
                  <div className="w-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-brand-standard-black">Foto</span>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"></div>
                    {/* <Avatar.Root className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                      <Avatar.Image
                        className="w-full h-full object-cover"
                        src=""
                      />
                    </Avatar.Root> */}
                  </div>
                </div>
                <div className="w-full h-full flex">
                  <div className="w-full flex justify-center flex-col gap-1">
                    <label
                      htmlFor="patient-photo-file"
                      className="w-[156px] text-base font-normal text-[#4573D2] cursor-pointer"
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
                      <div className="w-[516px] flex flex-col">
                        <p className="w-16 text-brand-standard-black font-semibold text-sm">Dica:</p>
                        <p className="w-[500px] text-gray-500 font-normal text-sm whitespace-nowrap">
                          Uma foto de perfil do paciente o ajuda a ser reconhecido na plataforma.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-4">
                <div className="w-44">
                  <div className="w-44 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="entry_date" text="Data de entrada" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register("entry_date")}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-44">
                  <div className="w-44 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="departure_date" text="Data de saída" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register("departure_date")}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="situation" text="Situação" />
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            width: '100%',
                            height: 40,
                            borderColor: state.isFocused ? '#e2e8f0' : '#e2e8f0',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 4,
                          colors: {
                            ...theme.colors,
                            primary75: '#cbd5e1',
                            primary50: '##e2e8f0',
                            primary25: '#f8fafc',
                            primary: '#212529',
                          },
                        })}
                        placeholder="Selecione a situação do paciente"
                        isSearchable={false}
                        options={situationOptions}
                        value={selectSituationValue ? situationOptions.find(x => x.value === selectSituationValue) : selectSituationValue}
                        onChange={option => selectSituationOnChange(option ? option.value : option)}
                        {...restSelectSituation}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-4">
                <div className="w-[368px]">
                  <div className="w-[368px] flex flex-col gap-3">
                    <Label htmlFor="name" text="Nome do paciente" />
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register('name')}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-3">
                    <Label htmlFor="specie" text="Nome da espécie" />
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register('specie')}  
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-4">
                <div className="w-[368px]">
                  <div className="w-[368px] flex flex-col gap-3">
                    <Label htmlFor="owner" text="Nome do dono(a)" />
                    <input
                      type="text"
                      className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                      {...register('owner')}  
                    />
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="race" text="Raça" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register('race')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row gap-4">
                <div className="w-44">
                  <div className="w-44 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="physical_shape" text="Porte físico" />
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            width: '100%',
                            height: 40,
                            borderColor: state.isFocused ? '#e2e8f0' : '#e2e8f0',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 4,
                          colors: {
                            ...theme.colors,
                            primary75: '#cbd5e1',
                            primary50: '##e2e8f0',
                            primary25: '#f8fafc',
                            primary: '#212529',
                          },
                        })}
                        placeholder="Selecione"
                        isSearchable={false}
                        options={physicalShapeOptions}
                        value={selectPhysicalShapeValue ? physicalShapeOptions.find(x => x.value === selectPhysicalShapeValue) : selectPhysicalShapeValue}
                        onChange={option => selectPhysicalShapeOnChange(option ? option.value : option)}
                        {...restSelectPhysicalShape}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-44">
                  <div className="w-44 flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="weight" text="Peso" />
                      <input
                        type="text"
                        className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:boder hover:border-[#b3b3b3]"
                        {...register('weight')}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex flex-col gap-6">
                    <div className="w-full flex flex-col gap-3">
                      <Label htmlFor="gender" text="Gênero" />
                      <Select
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            width: '100%',
                            height: 40,
                            borderColor: state.isFocused ? '#e2e8f0' : '#e2e8f0',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '0.875rem',
                            lineHeight: '1.25rem',
                          }),
                        }}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 4,
                          colors: {
                            ...theme.colors,
                            primary75: '#cbd5e1',
                            primary50: '##e2e8f0',
                            primary25: '#f8fafc',
                            primary: '#212529',
                          },
                        })}
                        placeholder="Selecione o sexo do paciente"
                        isSearchable={false}
                        options={genderOptions}
                        value={selectGenderValue ? genderOptions.find(x => x.value === selectGenderValue) : selectGenderValue}
                        onChange={option => selectGenderOnChange(option ? option.value : option)}
                        {...restSelectGender}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full flex flex-col gap-5">
                  <div className="w-full flex flex-col gap-3">
                    <Label htmlFor="diagnosis" text="Diagnóstico" />
                    <CreatableSelect
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: '100%',
                          minHeight: 40,
                          borderColor: state.isFocused ? '#e2e8f0' : '#e2e8f0',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '0.875rem',
                          lineHeight: '1.25rem',
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 4,
                        colors: {
                          ...theme.colors,
                          primary75: '#cbd5e1',
                          primary50: '##e2e8f0',
                          primary25: '#f8fafc',
                          primary: '#212529',
                        },
                      })}
                      components={{ DropdownIndicator: null }}
                      inputValue={diagnosisInputValue}
                      isClearable
                      isMulti
                      menuIsOpen={false}
                      onChange={(newValue) => setValueDiagnosis(newValue)}
                      onInputChange={(newValue) => setDiagnosisInputValue(newValue)}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite o nome da doença diagnosticada e depois aperte a tecla 'Enter'"
                      value={valueDiagnosis}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
