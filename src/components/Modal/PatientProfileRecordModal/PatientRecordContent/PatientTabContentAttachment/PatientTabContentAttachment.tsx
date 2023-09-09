import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { TabContentProps } from "../PatientRecordContent";
import Load from "../../../../Load/Load";
import AddAttachmentModal from "../../../AddAttachmentModal";
import { FileCard } from "../../../../Cards/FileCard";
import { useQuery } from "react-query";
import { api } from "../../../../../providers/Api";

type ListFilesResponse = {
  id: string;
  patientId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
}

const PatientTabContentAttachment: React.FC<TabContentProps> = ({ patientId, modalIsOpen }) => {
  const [callRequest, setCallRequest] = useState<boolean>(false);

  const { isLoading, data: patientFiles } = useQuery({
    queryKey: ["get-file-by-patientId"],
    queryFn: async () => {
      const response = await api.get<ListFilesResponse[]>(`/files/${patientId}/files`)
      return response.data
    },
    enabled: callRequest,
  })

  useEffect(() => {
    if (modalIsOpen != true) {
      setCallRequest(false);
    } else {
      setCallRequest(true);
    }
  }, [modalIsOpen, setCallRequest]);
  
  return (
    <Tabs.Content value="attachments">
      {isLoading && (
        <div className="w-full h-full absolute z-20">
          <div className="w-full h-full bg-[#f9fafb8b]">
            <Load
              divProps={{
                className:
                  "w-full h-[488px] relative flex items-center justify-center bg-gray-500-50",
              }}
            />
          </div>
        </div>
      )}
      <div
        id="modal-scroll"
        className="w-full h-[488px] px-6 py-6 overflow-y-scroll"
      >
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex justify-start">
            <AddAttachmentModal patientId={patientId} />
          </div>
          <div className="w-full grid grid-cols-3 gap-[28px]">
            {patientFiles &&
              patientFiles?.map((data) => (
                <FileCard
                  key={data.id}
                  id={data.id}
                  filename={data.filename}
                  fileUrl={data.fileUrl}
                  fileSize={data.fileSize}
                />
              ))}
          </div>
        </div>
      </div>
    </Tabs.Content>
  )
}

export default PatientTabContentAttachment;