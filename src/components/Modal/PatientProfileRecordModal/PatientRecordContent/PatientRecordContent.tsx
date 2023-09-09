import * as Tabs from "@radix-ui/react-tabs";
import PatientTabHeader from "./PatientTabHeader/PatientTabHeader";
import PatientTabContentProfile from "./PatientTabContentProfile/PatientTabContentProfile";
import PatientTabContentRecords from "./PatientTabContentRecords/PatientTabContentRecords";
import PatientTabContentExam from "./PatientTabContentExam/PatientTabContentExam";
import PatientTabContentAttachment from "./PatientTabContentAttachment/PatientTabContentAttachment";

export type TabContentProps = {
  patientId: string;
  modalIsOpen: boolean;
};

const PatientRecordModalContent: React.FC<TabContentProps> = ({
  patientId,
  modalIsOpen,
}) => {
  return (
    <Tabs.Root defaultValue="profile">
      <div className="w-full">
        <PatientTabHeader />
        <PatientTabContentProfile
          modalIsOpen={modalIsOpen}
          patientId={patientId}
        />
        <PatientTabContentRecords
          modalIsOpen={modalIsOpen}
          patientId={patientId}
        />
        <PatientTabContentExam
          modalIsOpen={modalIsOpen}
          patientId={patientId}
        />
        <PatientTabContentAttachment
          modalIsOpen={modalIsOpen}
          patientId={patientId}
        />
      </div>
    </Tabs.Root>
  );
};

export default PatientRecordModalContent;
