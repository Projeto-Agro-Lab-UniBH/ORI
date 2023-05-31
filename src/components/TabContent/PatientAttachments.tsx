import AddAttachmentModal from "../Modal/AddAttachmentModal";

type PatientAttachmentsProps = {
  patiendId: string;
  isOpen: boolean;
};

const PatientAttachments = (props: PatientAttachmentsProps) => {
  return (
    <div
      id="modal-scroll"
      className="w-full h-[488px] px-6 py-6 overflow-y-scroll"
    >
      <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full flex justify-start">
          <AddAttachmentModal patientId={props.patiendId} />
        </div>
        <div className="w-full grid grid-cols-4 gap-[28px]">
          <div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
          <div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
          <div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
          <div className="w-[146px] h-[146px] border rounded border-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default PatientAttachments;
