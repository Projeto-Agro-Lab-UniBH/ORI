import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import { Cross1Icon, Pencil2Icon } from '@radix-ui/react-icons';
import { Label } from '../Label/Label';
import { CreateExamModal } from './CreateExamModal';
import { PatientService } from '../../services/PatientService';
import { Load } from '../Load/Load';
import { useRouter } from 'next/router';

interface IEditPatientModalProps {
	patient: EditPatientModalProps;
}

export type EditPatientModalProps = {
	id: string;
	profile_photo: string;
	type: string;
	genre: string;
	weight: string;
	situation: string;
	physical_shape: string;
	entry_date?: string;
	departure_date?: string;
};

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string) => ({
  label,
  value: label,
});

const genderOptions = [
	{ value: 'Macho', label: 'Macho' },
	{ value: 'Fêmea', label: 'Fêmea' },
];

const physicalShapeOptions = [
	{ value: 'Grande porte', label: 'Grande porte' },
	{ value: 'Médio porte', label: 'Médio porte' },
	{ value: 'Leve porte', label: 'Leve porte' },
];

const situationOptions = [
	{ value: 'Alta', label: 'Alta' },
	{ value: 'Pronto pra alta', label: 'Pronto pra alta' },
	{ value: 'Em observação', label: 'Em observação' },
	{ value: 'Risco', label: 'Risco' },
	{ value: 'Alto risco', label: 'Alto risco' },
];

export function EditPatientModal(props: IEditPatientModalProps) {
	const { patient } = props;
	const { reset, register, control, handleSubmit } = useForm();
	const { replace } = useRouter();
	const { field: selectPhysicalShape } = useController({ name: 'physical_shape', control });
	const { field: selectGender } = useController({ name: 'gender', control });
	const { field: selectSituation } = useController({ name: 'situation', control });
	const { value: selectPhysicalShapeValue, onChange: selectPhysicalShapeOnChange, ...restSelectPhysicalShape } = selectPhysicalShape;
	const { value: selectGenderValue, onChange: selectGenderOnChange, ...restSelectGender } = selectGender;
	const { value: selectSituationValue, onChange: selectSituationOnChange, ...restSelectSituation } = selectSituation;

	const [diagnosisInput, setDiagnosisInputValue] = useState('');
  const [value, setValue] = useState<readonly Option[]>([]);

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!diagnosisInput) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev) => [...prev, createOption(diagnosisInput)]);
        setDiagnosisInputValue('');
        event.preventDefault();
    }
  };

	console.log(value)

	const [ìsLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

	useEffect(() => {
		if (patient.id) {
			setIsLoadingProfile(true);
			PatientService.patientProfile(patient.id)
				.then((res) => {
					reset(res?.data);
				})
				.finally(() => setIsLoadingProfile(false));
		}
	}, [patient?.id]);

	return (
		<Tabs.Root defaultValue="profile">
			<Dialog.Portal>
				<Dialog.Overlay className="bg-black/60 inset-0 fixed" />
				<Dialog.Content className="w-[720px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
					<div className="w-full px-6 mb-6 flex items-center flex-row justify-between">
						<Dialog.Title className="font-semibold text-2xl">Editar dados do paciente</Dialog.Title>
						<Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center" onClick={() => replace('/')}>
							<Cross1Icon width={24} height={24} />
						</Dialog.Close>
					</div>
					<div className="w-full">
						<Tabs.List className="w-full h-10 pl-6 flex flex-wrap -mb-px text-sm font-medium text-center border-b border-gray-200">
							<Tabs.Trigger
								value="profile"
								id="button-tab"
								className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							>
								Perfil
							</Tabs.Trigger>
							<Tabs.Trigger
								value="reports"
								id="button-tab"
								className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							>
								Relatório
							</Tabs.Trigger>
							<Tabs.Trigger
								value="exams"
								id="button-tab"
								className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							>
								Exames
							</Tabs.Trigger>
							<Tabs.Trigger
								value="attachments"
								id="button-tab"
								className="inline-block px-[12px] pt-[6px] pb-3 rounded-t-lg border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							>
								Documentos & Anexos
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="profile">
							{ìsLoadingProfile ? (
								<Load divProps={{ className: 'w-full h-[488px] flex items-center justify-center relative bg-gray-500-50' }} />
							) : (
								<div id="modal-scroll" className="w-full h-[488px] px-6 py-6 overflow-y-scroll">
									<form className="w-full flex flex-col gap-10">
										<div className="w-full flex flex-col gap-6">
											<div className="w-full flex flex-col gap-2">
												<div className="w-full flex items-center gap-4">
													<div className="w-[72px] h-full flex items-center flex-col gap-2">
														<div className="w-full flex items-center justify-center">
															<span className="text-sm font-semibold text-brand-standard-black">Foto</span>
														</div>
														<div className="w-full flex items-center justify-center">
															<Avatar.Root
																className={
																	!patient.profile_photo
																		? 'w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden'
																		: 'w-16 h-16 rounded-full flex items-center justify-center overflow-hidden'
																}
															>
																<Avatar.Image className="w-full h-full object-cover" src={!patient.profile_photo ? '' : patient.profile_photo} />
															</Avatar.Root>
														</div>
													</div>
													<div className="w-full h-full flex">
														<div className="w-full flex justify-center flex-col gap-1">
															<label htmlFor="patient-photo-file" className="w-[156px] text-base font-normal text-[#4573D2] cursor-pointer">
																Selecionar uma foto
															</label>
															<input type="file" id="patient-photo-file" name="patientPhotoFile" className="hidden" />
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
												<div className="w-full h-10 flex items-center gap-2">
													<span className="text-sm font-semibold text-brand-standard-black">ID:</span>
													<p className="text-base font-normal text-brand-standard-black">{props.patient.id}</p>
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
																{...register('entry_date')}
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
																{...register('departure_date')}
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
																value={selectSituationValue ? situationOptions.find((x) => x.value === selectSituationValue) : selectSituationValue}
																onChange={(option) => selectSituationOnChange(option ? option.value : option)}
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
														<Label htmlFor="specie" text="Espécie" />
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
																value={
																	selectPhysicalShapeValue
																		? physicalShapeOptions.find((x) => x.value === selectPhysicalShapeValue)
																		: selectPhysicalShapeValue
																}
																onChange={(option) => selectPhysicalShapeOnChange(option ? option.value : option)}
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
																onChange={(option) => selectGenderOnChange(option ? option.value : option)}
																value={selectGenderValue ? genderOptions.find((x) => x.value === selectGenderValue) : selectGenderValue}
																{...restSelectGender}
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="w-full">
												<div className="w-full flex flex-col gap-5">
													<div className="w-full flex flex-col gap-3">
														<Label htmlFor="" text="Diagnóstico" />
														<CreatableSelect
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
															components={{ DropdownIndicator: null }}
															inputValue={diagnosisInput}
															isClearable
															isMulti
															menuIsOpen={false}
															onInputChange={(newValue) => setDiagnosisInputValue(newValue)}
															onChange={(newValue) => setValue(newValue)}
															onKeyDown={handleKeyDown}
															placeholder="Digite o nome da doença diagnosticada e depois aperte a tecla 'Enter'"
															value={value}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="w-full flex justify-end">
											<button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
												Salvar alterações
											</button>
										</div>
									</form>
								</div>
							)}
						</Tabs.Content>
						<Tabs.Content value="reports">
							<div id="modal-scroll" className="w-full h-[362px] px-6 py-6 mb-6 overflow-y-scroll">
								<div className="w-full flex flex-col items-center gap-6">
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
													<span className="text-sm text-brand-standard-black font-semibold">ID:</span>
													<p className="text-base font-normal text-brand-standard-black">7a6401c5-e894-4da9-9b66-9ab7ce4d0a08</p>
												</div>
												<div className="w-full flex-row flex items-center gap-5">
													<div className="flex items-center gap-1">
														<span className="text-sm text-brand-standard-black font-semibold">Data de criação:</span>
														<p className="text-base font-normal text-brand-standard-black">00/00/00</p>
													</div>
													<div className="flex items-center gap-1">
														<span className="text-sm text-brand-standard-black font-semibold">Data da última edição:</span>
														<p className="text-base font-normal text-brand-standard-black">00/00/00</p>
													</div>
												</div>
											</div>
											<div className="w-full">
												<p className="text-base font-normal text-brand-standard-black">
													Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum rutrum ipsum eget aliquam. Curabitur gravida,
													tellus quis convallis pretium, dolor felis dignissim mauris, vitae feugiat nunc arcu quis orci.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="w-full flex justify-end px-6 py-6">
								<Dialog.Root>
									<Dialog.Trigger className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
										Criar um relatório
									</Dialog.Trigger>
									<Dialog.Portal>
										<Dialog.Overlay className="bg-black/60 inset-0 fixed" />
										<Dialog.Content className="w-[608px] rounded-lg border border-gray-200 fixed pt-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white overflow-hidden">
											<div className="w-full px-6 pb-4 border-b-[1px] border-gray-200 flex items-center flex-row justify-between">
												<Dialog.Title className="font-semibold text-2xl">Criar um novo relatório</Dialog.Title>
												<Dialog.Close className="w-[32px] h-[32px] flex justify-center items-center">
													<Cross1Icon width={24} height={24} />
												</Dialog.Close>
											</div>
											<div className="w-full px-6 py-6">
												<form className="w-full flex flex-col h-360 gap-8">
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
													<div className="w-full flex justify-end">
														<button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
															Salvar alterações
														</button>
													</div>
												</form>
											</div>
										</Dialog.Content>
									</Dialog.Portal>
								</Dialog.Root>
							</div>
						</Tabs.Content>
						<Tabs.Content value="exams">
							<div id="modal-scroll" className="w-full h-[356px] px-6 py-6 mb-6 overflow-y-scroll">
								<div className="w-full flex flex-col items-center gap-6">
									<div className="w-full flex flex-row gap-4">
										<div className="w-[238px]">
											<input
												type="text"
												className="w-[196px] h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
											/>
										</div>
										<div className="w-full">
											<input
												type="text"
												className="w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white"
											/>
										</div>
									</div>
									<hr className="w-full border-gray-200" />
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
													<span className="text-sm text-brand-standard-black font-semibold">ID:</span>
													<p className="text-base font-normal text-brand-standard-black">7a6401c5-e894-4da9-9b66-9ab7ce4d0a08</p>
												</div>
												<div className="w-full flex-row flex items-center gap-5">
													<div className="flex items-center gap-1">
														<span className="text-sm text-brand-standard-black font-semibold">Data de criação:</span>
														<p className="text-base font-normal text-brand-standard-black">00/00/00</p>
													</div>
													<div className="flex items-center gap-1">
														<span className="text-sm text-brand-standard-black font-semibold">Data da última edição:</span>
														<p className="text-base font-normal text-brand-standard-black">00/00/00</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="w-full flex justify-end px-6 py-6">
								<Dialog.Root>
									<Dialog.Trigger className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
										Cadastrar novo exame
									</Dialog.Trigger>
									<CreateExamModal />
								</Dialog.Root>
							</div>
						</Tabs.Content>
						<Tabs.Content value="attachments">
							<div id="modal-scroll" className="w-full h-[488px] px-6 py-6 overflow-y-scroll">
								<div className="w-full flex flex-col items-center gap-6">
									<div className="w-full flex justify-start">
										<button className="border border-gray-200 px-3 py-[6px] rounded text-base text-brand-standard-black font-medium bg-white hover:bg-gray-50">
											Anexar documento
										</button>
									</div>
									<div className="w-full grid grid-cols-4 gap-[28px]">
										<div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
										<div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
										<div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
										<div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
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
