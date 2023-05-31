import ExamCard from "../Cards/ExamCard";
import RegisterExamModal from "../Modal/RegisterExamModal";

type PatientExamsContentProps = {
  patientId: string;
  isOpen: boolean;
} 

const PatientExamsContent = (props: PatientExamsContentProps) => {
  return (
    <>
      <div
        id="modal-scroll"
        className="w-full h-[362px] px-6 py-6 overflow-y-scroll"
      >
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-6">
            <ExamCard />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end px-6 py-6">
        <RegisterExamModal />
      </div>
    </>
  );
};

export default PatientExamsContent