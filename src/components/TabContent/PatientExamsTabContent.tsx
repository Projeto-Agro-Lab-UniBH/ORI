import StakedExamList from "../Lists/StakedExamList";
import RegisterExamModal from "../Modal/RegisterExamModal";

type PatientExamsTabContentProps = {
  patientId: string;
  isOpen: boolean;
} 

const PatientExamsTabContent = (props: PatientExamsTabContentProps) => {
  return (
    <>
      <div
        id="modal-scroll"
        className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
      >
        <StakedExamList />
      </div>
      <div className="w-full flex justify-end px-6 py-6">
        <RegisterExamModal />
      </div>
    </>
  );
};

export default PatientExamsTabContent