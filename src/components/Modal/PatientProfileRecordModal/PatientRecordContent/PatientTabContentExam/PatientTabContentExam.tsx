import * as Tabs from "@radix-ui/react-tabs";
import Load from "../../../../Load/Load";
import ExamItem from "../../../../Items/ExamItem";
import RegisterPatientExamModal from "../../../RegisterPatientExamModal";
import { TabContentProps } from "../PatientRecordContent";
import { useEffect, useState } from "react";
import { api } from "../../../../../providers/Api";
import { useQuery } from "react-query";

type ListExamsResponse = {
  id: string;
  patientId: string;
  date: string;
  author: string;
  type_of_exam: string;
  annotations: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

const PatientTabContentExam: React.FC<TabContentProps> = ({ patientId, modalIsOpen }) => {
  const [callRequest, setCallRequest] = useState<boolean>(false);
  
  const { isLoading, data: patientExams } = useQuery({
    queryKey: ["list-all-exams"],
    queryFn: async () => {
      const response = await api.get<ListExamsResponse[]>(`/exams/${patientId}/exams`)
      return response.data 
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
    <Tabs.Content value="exams">
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
            {patientExams &&
              patientExams.map((data) => (
                <ExamItem
                  key={data.id}
                  id={data.id}
                  patientId={data.patientId}
                  date={data.date}
                  author={data.author}
                  type_of_exam={data.type_of_exam}
                  annotations={data.annotations}
                  filename={data.filename}
                  fileUrl={data.fileUrl}
                  fileSize={data.fileSize}
                  createdAt={data.createdAt}
                  updatedAt={data.updatedAt}
                />
              ))}
          </div>
        </div>
        <div className="w-full h-10 px-6 flex justify-end">
          <RegisterPatientExamModal patientId={patientId} />
        </div>
      </div>
    </Tabs.Content>
  )
}

export default PatientTabContentExam;