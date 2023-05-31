import { useQuery } from "react-query";
import ReportCard from "../Cards/ReportCard";
import RegisterReportModal from "../Modal/RegisterReportModal";
import { api } from "../../providers/Api";
import { Load } from "../Load/Load";

type PatientReportsContentProps = {
  patientId: string;
  isOpen: boolean;
};

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


const PatientReportsContent = (props: PatientReportsContentProps) => {
  const { isLoading, data } = useQuery<PatientReportResponse[] | null>({
    queryKey: ["list-all-reports"], 
    queryFn: async () => {
      const response = await api.get<PatientReportResponse[]>(`/reports/${props.patientId}/reports`)
      return response.data;
    }
  });

  return (
    <>
      <div
        id="modal-scroll"
        className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
      >
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
              <ReportCard
                key={data.id}
                id={data.id}
                patientId={data.patientId}
                shift={data.shift}
                author={data.author}
                report_text={data.report_text}
                createdAt={data.createdAt}
                updatedAt={data.updatedAt}
              />
            ))
          )}
        </div>
      </div>
      <div className="w-full flex justify-end px-6 py-6">
        <RegisterReportModal patientId={props.patientId} />
      </div>
    </>
  );
};

export default PatientReportsContent;
