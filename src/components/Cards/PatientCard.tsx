import * as Avatar from '@radix-ui/react-avatar';
import { CopyIcon, CameraIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EditPatientModal from '../Modal/EditPatientModal';
import { Badges } from '../Badges/Badges';
import { Option } from '../../interfaces/Option';

type PatientCardProps = {
	id: string;
  profile_photo?: string;
  name: string;
	race: string;
  specie: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
	exams: Array<string>;
};

const PatientCard = (props: PatientCardProps) => {
	const [copyArea, setCopyArea] = useState('');

	useEffect(() => {
		setCopyArea(props.id);
	}, [props.id]);

	return (
		<div className="w-full h-[104px] px-4 pt-2 pb-2 flex items-center bg-white border border-gray-200 rounded-lg">
			<div id="animal-patient-card-scroll" className="w-full flex items-center border-none rounded-lg overflow-x-scroll">
				<div className="h-20 flex items-center p-2 gap-10">
					<div className="flex gap-4">
						<div className="w-[88px] flex items-center flex-col">
							<span className="w-full mb-2 text-lg font-semibold text-brand-standard-black">ID:</span>
							<div className="w-full h-full flex items-center gap-2">
								<div className="w-[64px] h-6 bg-brand-standard-black border-none rounded flex items-center px-2">
									<span className="whitespace-nowrap text-sm font-normal text-white overflow-hidden overflow-ellipsis">{copyArea}</span>
								</div>
								<CopyToClipboard text={copyArea}>
									<button className="w-6 h-6 flex items-center justify-center border-none rounded bg-none hover:bg-slate-50">
										<CopyIcon color="#212529" />
									</button>
								</CopyToClipboard>
							</div>
						</div>
						<div className="w-[224px] h-full flex items-center">
							<EditPatientModal patientId={props.id}>
								<div className="w-16 h-16 flex items-center">
									<Avatar.Root
										className={
											!props.profile_photo
												? 'w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden'
												: 'w-16 h-16 rounded-full flex items-center justify-center overflow-hidden'
										}
									>
										{!props.profile_photo ? (
											<div className="w-4 h-4">
												<CameraIcon className="w-full h-full object-cover" color="#e5e7eb" />
											</div>
										) : (
											<Avatar.Image className="w-full h-full object-cover" src={props.profile_photo} />
										)}
									</Avatar.Root>
								</div>
								<div className="w-full flex items-center max-w-[164px]">
									<div className="w-full max-w-[164px] flex items-center flex-col">
										<p className="w-full flex whitespace-nowrap text-xl font-semibold text-brand-standard-black overflow-hidden text-ellipsis">
											{!props.name ? 'Sem nome' : props.name}
										</p>
										<p className="w-full flex whitespace-nowrap text-lg font-light text-brand-standard-black overflow-hidden text-ellipsis">
											{!props.specie ? 'Não registrado' : props.specie}
										</p>
									</div>
								</div>
							</EditPatientModal>
						</div>
					</div>
					<div className="flex gap-10">
						<div className="w-[256px] flex items-center flex-col">
							<span className="w-[256px] whitespace-nowrap text-lg font-semibold text-brand-standard-black mb-2">Dados do paciente:</span>
							<div className="w-full flex items-center flex-row gap-2">
								{!props.gender ? null : <Badges data={props.gender} />}
								{!props.physical_shape ? null : <Badges data={props.physical_shape} />}
								{!props.weight ? null : <Badges data={props.weight} />}
							</div>
						</div>
						<div className="w-[124px] flex items-center flex-col">
							<span className="w-[124px] whitespace-nowrap text-lg font-semibold text-brand-standard-black mb-2">Prognóstico:</span>
							<div className="w-full flex items-center flex-row gap-2">
								<Badges data={!props.prognosis ? 'Sem dados' : props.prognosis} />
							</div>
						</div>
						<div className="w-full flex items-center flex-col">
							<span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">Diagnóstico / Suspeita Clínica:</span>
							<div className="w-full flex items-center flex-row gap-2">
								{props.diagnosis.map((data) => <Badges key={data.label} data={data.value} /> )}
							</div>
						</div>
						<div className="w-full flex items-center flex-col">
							<span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">Exames:</span>
							<div className="w-full flex items-center flex-row gap-2">
								{props.exams.map((data) =>
									!data ? (
										<span className="whitespace-nowrap text-sm font-normal text-brand-standard-black">Sem dados</span>
									) : (
										<Badges key={props.id} data={data} />
									)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PatientCard