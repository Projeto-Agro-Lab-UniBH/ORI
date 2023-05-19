import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import { ExitIcon, MagnifyingGlassIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons';
import { useContext, useState } from 'react';
import Select from 'react-select';
import { useQuery } from 'react-query';
import { PatientService } from '../services/PatientService';
import { AuthContext } from '../contexts/AuthContext';
import { PatientCard } from '../components/Cards/PatientCard';
import { EditPatientModal, EditPatientModalProps } from '../components/Modal/EditPatientModal';
import { EditProfileModal } from '../components/Modal/EditProfileModal';
import { RegisterPatientModal } from '../components/Modal/RegisterPatientModal';

type SelectAnimalType = {
	label: string;
	value: string;
};

const animalTypeOptions = [
	{ value: 'Aves', label: 'Aves' },
	{ value: 'Bovino', label: 'Bovino' },
	{ value: 'Canino', label: 'Canino' },
	{ value: 'Equino', label: 'Equino' },
	{ value: 'Felino', label: 'Felino' },
	{ value: 'Silvestre', label: 'Silvestre' },
];

export default function Home() {
	const { user } = useContext(AuthContext);
	const [selectAnimalType, setSelectAnimalType] = useState<SelectAnimalType | null>();
	const [searchInput, setSearchInput] = useState<string>('');
	const [selectedPatient, setSelectedPatient] = useState<EditPatientModalProps>({} as EditPatientModalProps);

	const { data, isLoading } = useQuery('list', async () => {
		const response = await PatientService.listAllPatients();
		return response.data;
	});

	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(event.target.value);
	};

	return (
		<>
			<div className="w-full h-14 my-6 flex justify-center">
				<div className="w-[1280px] flex justify-between">
					<Dialog.Root>
						<div className="w-[408px] flex items-center gap-2">
							<Dialog.Trigger className="w-14 h-14 flex items-center justify-center">
								<Avatar.Root
									className={
										!user?.profile_photo
											? 'w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden'
											: 'w-10 h-10 rounded-full flex items-center justify-center overflow-hidden'
									}
								>
									{!user?.profile_photo ? (
										<div className="w-[14px] h-[14px]">
											<PersonIcon color="#e5e7eb" className="w-full h-full object-cover" />
										</div>
									) : (
										<Avatar.Image className="w-full h-full object-cover" src={user?.profile_photo} />
									)}
								</Avatar.Root>
							</Dialog.Trigger>
							<div className="w-[352px] h-14 flex justify-center items-center flex-col">
								<div className="w-full flex text-[18px] font-semibold">{!user?.username ? 'Lorem Ipsum' : user?.username}</div>
								<div className="w-full flex text-[14px] font-light">{!user?.email ? 'loremipsum@email.com' : user?.email}</div>
							</div>
						</div>
						<EditProfileModal />
					</Dialog.Root>
					<div className="w-14 h-14 flex justify-end items-center">
						<button className="w-8 h-8 rounded flex justify-center items-center hover:bg-slate-50">
							<ExitIcon width={16} height={16} />
						</button>
					</div>
				</div>
			</div>
			<div className="w-full h-full flex justify-center px-14 pt-6 flex-col items-center mb-6">
				<div className="w-[1280px] h-24 flex items-center flex-col mb-8 gap-4 border-b border-gray-200">
					<div className="w-full h-24 flex items-center gap-4">
						<Select
							styles={{
								control: (baseStyles, state) => ({
									...baseStyles,
									width: 238,
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
									primary50: '#e2e8f0',
									primary25: '#f8fafc',
									primary: '#212529',
								},
							})}
							isClearable
							isSearchable={false}
							placeholder="Selecionar tipo de animal"
							options={animalTypeOptions}
							onChange={(value) => setSelectAnimalType(value)}
						/>
						<div className="relative w-full">
							<div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
								<MagnifyingGlassIcon />
							</div>
							<input
								type="text"
								id="search"
								className="block w-full h-10 p-4 pl-8 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:border-[#b3b3b3]"
								placeholder="Procurar por nome, espécie, tipo..."
								value={searchInput}
								onChange={handleSearchInput}
							/>
						</div>
						<button className="w-[156px] h-10 bg-brand-standard-black rounded text-white font-normal hover:border hover:bg-white hover:text-brand-standard-black">
							Procurar
						</button>
						<Dialog.Root>
							<Dialog.Trigger className="w-[56px] h-10 border rounded flex justify-center items-center hover:boder hover:border-[#b3b3b3]">
								<PlusIcon color="#212529" width={20} height={20} />
							</Dialog.Trigger>
							<RegisterPatientModal />
						</Dialog.Root>
					</div>
				</div>
				<div className="w-[1280px] h-full mb-12 flex flex-col gap-6">
					<Dialog.Root>
						{isLoading && <p>Carregando</p>}
						{data?.map((data) => (
							<PatientCard
								key={data.id}
								id={data.id}
								name={data.name}
								specie={data.specie}
								profile_photo={data.profile_photo}
								type={data.type}
								physical_shape={data.physical_shape}
								gender={data.gender}
								weight={data.weight}
								situation={data.situation}
								diagnosis={data.diagnosis}
								exams={['Hemograma']}
								onSelectedPatient={setSelectedPatient}
							/>
						))}
						<EditPatientModal patient={selectedPatient} />
					</Dialog.Root>
				</div>
			</div>
		</>
	);
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const apiClient = getAPIClient(ctx);
//   const { ["jwt"]: token } = parseCookies(ctx);
//   if (!token) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
