import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import { ExitIcon, MagnifyingGlassIcon, PersonIcon, PlusIcon } from '@radix-ui/react-icons';
import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { useQuery } from 'react-query';
import { PatientService } from '../services/PatientService';
import { AuthContext } from '../contexts/AuthContext';
import { PatientCard } from '../components/Cards/PatientCard';
import { EditPatientModal, EditPatientModalProps } from '../components/Modal/EditPatientModal';

interface ISelectAnimalType {
	label: string;
	value: string;
}

interface PatientResponse {
	id: string;
	profile_photo: string;
	name: string;
	owner: string;
	specie: string;
	gender: string;
	type: string;
	weight: string;
  situation: string;
	physical_shape: string;
	entry_date: string;
	departure_date: string;
}

const animalTypeOptions = [
  { value: 'Aves', label: 'Aves' },
  { value: 'Bovino', label: 'Bovino' },
  { value: 'Canino', label: 'Canino' },
  { value: 'Equino', label: 'Equino' },
  { value: 'Felino', label: 'Felino' },
  { value: 'Silvestre', label: 'Silvestre' },
]

export default function Home() {
	const { user } = useContext(AuthContext);
	const [selectAnimalType, setSelectAnimalType] = useState<ISelectAnimalType | null>();
	const [searchInput, setSearchInput] = useState<string>('');
	const [data, setData] = useState<PatientResponse[] | undefined>([]);
	const [selectedPatient, setSelectedPatient] = useState<EditPatientModalProps>({} as EditPatientModalProps);

	const { data: patients, isLoading } = useQuery('animal', async () => {
		const response = await PatientService.listAllPatients();
		return response.data;
	});

	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(event.target.value);
	};

	useEffect(() => {
		setData(patients);
	}, [patients]);

	useEffect(() => {
		if (selectAnimalType?.value != null) {
			setData(patients?.filter((patients) => patients.type.includes(selectAnimalType.value)));
		} else {
			setData(patients);
		}
	}, [selectAnimalType, patients]);

	return (
		<>
			<div className="h-14 flex items-center mt-6 pl-4 pr-4 justify-between">
        <Dialog.Root>
          <div className="w-[408px] flex items-center gap-2">
            <Dialog.Trigger className="w-14 h-14 flex items-center justify-center">
              <Avatar.Root className={!user?.profile_photo ? "w-10 h-10 border border-black rounded-full flex items-center justify-center overflow-hidden" : "w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"}>
                {!user?.profile_photo ? (
                  <div className="w-[14px] h-[14px]">
                    <PersonIcon className="w-full h-full object-cover" />
                  </div>
                  ) : (
                  <Avatar.Image className="w-full h-full object-cover" src={user?.profile_photo} /> 
                )}
              </Avatar.Root>
            </Dialog.Trigger>
            <div className="w-[352px] h-14 flex justify-center items-center flex-col">
              <div className="w-full flex text-[18px] font-semibold">
                {!user?.username ? "Lorem Ipsum" : user?.username}
              </div>
              <div className="w-full flex text-[14px] font-light">
                {!user?.email ? "loremipsum@email.com" : user?.email}
              </div>
            </div>
          </div>    
				</Dialog.Root>
        <div className="w-14 h-14 flex justify-end items-center">
					<button className="w-8 h-8 rounded flex justify-center items-center hover:bg-slate-50">
						<ExitIcon width={16} height={16} />
					</button>
				</div>
			</div>
			<div className="w-full h-full flex justify-center px-14 pt-5 flex-col items-center mb-6">
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
                photo={data.profile_photo}
                animal_type={data.type}
                physical_shape={data.physical_shape}
                genre={data.gender}
                weight={data.weight}
                situation={data.situation}
                diagnosis={['Gripe Canina']}
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
