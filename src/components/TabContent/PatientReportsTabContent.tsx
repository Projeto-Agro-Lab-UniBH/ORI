import RegisterReportModal from '../Modal/RegisterReportModal';
import StakedReportList from '../Lists/StakedReportList';

type PatientReportsTabContentProps = {
	patientId: string;
	isOpen: boolean;
};

const PatientReportsTabContent = (props: PatientReportsTabContentProps) => {
	return (
		<>
			<div id="modal-scroll" className="w-full h-[362px] px-6 py-6 overflow-y-scroll">
				<StakedReportList patientId={props.patientId} />
			</div>
			<div className="w-full flex justify-end px-6 py-6">
				<RegisterReportModal patientId={props.patientId} />
			</div>
		</>
	);
};

export default PatientReportsTabContent;
