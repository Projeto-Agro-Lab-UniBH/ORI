import { useQuery } from 'react-query';
import Report from '../Report';
import { api } from '../../providers/Api';
import { Load } from '../Load/Load';

type StakedReportListProps = {
  patientId: string;
}

type PatientReportResponse = {
	id: string;
	patientId: string;
	shift: string;
	author: string;
	report_text: string;
	createdAt: string;
	updatedAt: string;
	attachments: string;
};

const StakedReportList = (props: StakedReportListProps) => {
  const { isLoading, data } = useQuery<PatientReportResponse[] | null>({
		queryKey: ['list-all-reports'],
		queryFn: async () => {
			const response = await api.get<PatientReportResponse[]>(`/reports/${props.patientId}/reports`);
			return response.data;
		},
	});

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {isLoading ? (
        <Load
          divProps={{
            className:
              "w-full h-[488px] flex items-center justify-center relative bg-gray-500-50",
          }}
        />
      ) : (
        data?.map((data) => (
          <Report
            key={data.id}
            id={data.id}
            patientId={data.patientId}
            shift={data.shift}
            author={data.author}
            report_text={data.report_text}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
            attachments={data.attachments}
          />
        ))
      )}
    </div>
  );
};

export default StakedReportList;
