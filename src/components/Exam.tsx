import EditPatientExamModal from "./Modal/EditPatientExamModal";

const Exam = () => {
  return (
    <div className="w-full flex flex-col items-center gap-6 pb-6 border-b border-gray-200">
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="w-[504px] items-center flex">
            <span className="w-[504px] whitespace-nowrap text-2xl text-brand-standard-black font-semibold overflow-hidden text-ellipsis">
              Lorem ipsum
            </span>
          </div>
          <EditPatientExamModal />
        </div>
        <div className="w-full flex-row flex items-center gap-5">
          <div className="flex items-center gap-1">
            <span className="text-sm text-brand-standard-black font-semibold">
              Data de realização do exame:
            </span>
            <p className="text-base font-normal text-brand-standard-black">
              00/00/00
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <span className="w-full flex items-center text-sm text-brand-standard-black font-semibold">
            Anexos e fotos
          </span>
          <div className="grid grid-cols-9 gap-[10px]">
            <div className="w-[64px] h-[64px] border rounded border-gray-200 hover:bg-[#a3a3a3c3]">

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Exam;
