import EditPatientReportModal from "../../Modal/EditPatientReportModal";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type ReportItemProps = {
  id: string;
  patientId: string;
  shift: string;
  author: string;
  title: string;
  report_text: string;
  filename: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
};

const ReportItem: React.FC<ReportItemProps> = ({ 
  id,
  patientId,
  shift,
  author,
  title,
  report_text,
  filename,
  fileUrl,
  createdAt,
  updatedAt 
}) => {
  const [download, setDownload] = useState<any>({} as any);

  useEffect(() => {
    if (fileUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = `${fileUrl}`;
      setDownload(downloadLink);
    }
  }, [fileUrl]);

  const downloadFile = (event: any) => {
    event.preventDefault();
    download.click();
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full flex flex-col items-center gap-3 pb-6 border-b border-gray-200">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-[504px] items-center flex">
              <span className="w-[504px] whitespace-nowrap text-2xl text-brand-standard-black font-semibold overflow-hidden text-ellipsis">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <EditPatientReportModal
                id={id}
                patientId={patientId}
              />
            </div>
          </div>
          <div className="w-full font-light text-brand-standard-black">
            {author}
          </div>
          <div className="w-full flex-row flex justify-between items-center">
            <div className="w-full flex-row flex items-center gap-5">
              <div className="flex items-center gap-1">
                <span className="text-sm text-brand-standard-black font-semibold">
                  Turno:
                </span>
                <p className="text-base font-normal text-brand-standard-black">
                  {shift}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-brand-standard-black font-semibold">
                  Data de criação:
                </span>
                <p className="text-base font-normal text-brand-standard-black">
                  {createdAt}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-brand-standard-black font-semibold">
                  Data da última edição:
                </span>
                <p className="text-base font-normal text-brand-standard-black">
                  {updatedAt}
                </p>
              </div>
            </div>
          </div>
          {fileUrl && (
            <div className="w-full flex gap-2 items-center">
              <button
                onClick={downloadFile}
                className="px-2 py-1 border border-gray-200 rounded hover:border-[#b3b3b3] flex items-center text-brand-standard-black font-semibold gap-1"
              >
                Baixar anexo <DownloadIcon />
              </button>
            </div>
          )}
        </div>
        <div className="w-full">
          <p className="text-base font-normal text-brand-standard-black">
            {report_text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
