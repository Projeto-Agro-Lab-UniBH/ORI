import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { TabContentProps } from "../PatientRecordContent";
import { useQuery } from "react-query";
import { api } from "../../../../../providers/Api";
import Load from "../../../../Load/Load";
import ReportItem from "../../../../Items/ReportItem";
import RegisterPatientReportModal from "../../../RegisterPatientReportModal";

type ListReportsResponse = {
	id: string;
	patientId: string;
	shift: string;
	author: string;
	title: string;
	report_text: string;
	filename: string;
  fileUrl: string;
  fileSize: number;
	createdAt: string;
	updatedAt: string;
};

const PatientTabContentRecords: React.FC<TabContentProps> = ({ patientId, modalIsOpen }) => {
  const [callRequest, setCallRequest] = useState<boolean>(false);
  
  const { isLoading, data: patientReports } = useQuery({
		queryKey: ['list-all-reports'],
		queryFn: async () => {
			const response = await api.get<ListReportsResponse[]>(`/reports/${patientId}/reports`);
			return response.data;
		},
		enabled: callRequest,
	});

  useEffect(() => {
    if (modalIsOpen != true) {
      setCallRequest(false);
    } else {
      setCallRequest(true);
    }
  }, [modalIsOpen, setCallRequest]);

  return (
    <Tabs.Content value="reports">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <Load
              divProps={{
                className:
                  "w-full h-[362px] relative flex items-center justify-center bg-gray-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div className="w-full flex flex-col pb-6 items-center gap-6">
        <div
          id="modal-scroll"
          className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
        >
          <div className="w-full flex flex-col items-center gap-6">
            {patientReports &&
              patientReports?.map((data) => (
                <ReportItem
                  key={data.id}
                  id={data.id}
                  patientId={data.patientId}
                  shift={data.shift}
                  author={data.author}
                  title={data.title}
                  report_text={data.report_text}
                  filename={data.filename}
                  fileUrl={data.fileUrl}
                  createdAt={data.createdAt}
                  updatedAt={data.updatedAt}
                />
              ))}
          </div>
        </div>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientReportModal patientId={patientId} />
        </div>
      </div>
    </Tabs.Content>
  )
};

export default PatientTabContentRecords;