import { DownloadIcon } from "@radix-ui/react-icons";
import EditPatientExamModal from "../Modal/EditPatientExamModal";
import { Document, Page } from "react-pdf";
import { useEffect, useState } from "react";

type ExamCardProps = {
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

const ExamCard = (props: ExamCardProps) => {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [attachedFile, setAttachedFile] = useState<string | undefined>(undefined)
  const [textNotes, setTextNotes] = useState<string | undefined>(undefined)
  const [download, setDownload] = useState<any>({} as any);

  useEffect(() => {
    if (props.fileUrl != null) {
      setAttachedFile(props.fileUrl);
    }

    if (props.annotations != null) {
      setTextNotes(props.annotations);
    }
  }, [props, setAttachedFile, setTextNotes])

  useEffect(() => {
    if (props.fileUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = `${props.fileUrl}`;
      setDownload(downloadLink);
    }
  }, [props]);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 pb-6 border-b border-gray-200">
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-[504px] items-center flex">
              <span className="w-[504px] whitespace-nowrap text-2xl text-brand-standard-black font-semibold overflow-hidden text-ellipsis">
                {props.type_of_exam}
              </span>
            </div>
            <EditPatientExamModal 
              id={props.id} 
              patientId={props.patientId} 
            />
          </div>
          <div className="w-full font-light text-brand-standard-black">
            {props.author}
          </div>
          <div className="w-full flex-row flex items-center gap-5">
            <div className="flex items-center gap-1">
              <span className="text-sm text-brand-standard-black font-semibold">
                Data de realização do exame:
              </span>
              <p className="text-base font-normal text-brand-standard-black">
                {props.date}
              </p>
            </div>
          </div>
          {attachedFile && 
            <div className="w-[664.8px] border rounded border-gray-200 overflow-hidden flex flex-col items-center">
              <div className="w-[664.8px] h-44 overflow-hidden">
                <div className="w-[664.8px] h-44 flex px-2 py-2 rounded justify-end absolute z-10">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => download.click()}
                      className="w-[26px] h-[26px] flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer"
                    >
                      <DownloadIcon 
                        color="#212529" 
                        width={16} 
                        height={16} 
                      />
                    </button>
                  </div>
                </div>
                <Document
                  file={attachedFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={1} width={664.8} />
                </Document>
              </div>
            </div>
          }
          {textNotes &&
            <div className="w-full">
              <p className="text-base font-normal text-brand-standard-black">
                {textNotes}
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
