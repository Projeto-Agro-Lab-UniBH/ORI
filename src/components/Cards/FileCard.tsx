import Image from "next/image";
import { useEffect, useState } from "react";
import { Document, Page } from 'react-pdf'; 
import { DownloadIcon } from '@radix-ui/react-icons';
import { formatFileSize } from "../../functions/formatBytes";
import WarningToDeleteAttachmentModal from "../Modal/WarningToDeleteAttachmentModal";

type FileCardProps = {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
};

export const FileCard = (props: FileCardProps) => {
  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [download, setDownload] = useState<any>({} as any);
  
	useEffect(() => {
    if (props.fileUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = `${props.fileUrl}`
      setDownload(downloadLink)
    }
  }, [props]);

  const downloadFile = (event: any) => {
    event.preventDefault();
    download.click();
  }
  
  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  return (
    <div className="w-[202.8px] border rounded border-gray-200 overflow-hidden flex flex-col items-center">
      <div className="w-[202.8px] h-[264px] overflow-hidden">
        <div className="w-[202.8px] h-[264px] flex px-2 py-2 rounded justify-end absolute z-10">
          <div className="flex flex-col gap-2">
            <button
              onClick={downloadFile} 
              className="w-[26px] h-[26px] flex justify-center items-center bg-white border rounded border-gray-200 overflow-hidden cursor-pointer"
            >
              <DownloadIcon 
                color="#212529" 
                width={16} 
                height={16} 
              />
            </button>
            <WarningToDeleteAttachmentModal id={props.id} />
          </div>
        </div>
        <Document
          file={props.fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={1} width={202.8} />
        </Document>
      </div>
      <div className="w-[202.8px] h-14 border-t-[1px] border-gray-200 flex items-center p-2 gap-1">
        <Image 
          src="/pdf-svgrepo-com.svg" 
          alt="pdf-icon" 
          width={24} 
          height={24} 
        />
        <div className="w-[192px] flex flex-col items-center justify-center">
          <div className="w-[164px] whitespace-nowrap overflow-hidden text-ellipsis">
            <p className="max-w-[164px] whitespace-nowrap overflow-hidden text-ellipsis font-semibold text-[14.8px]">
              {(props.filename).split('.').slice(0, -1).join('.')}
            </p>  
          </div>
          <div className="w-[164px] flex flex-row items-center text-center gap-1">
            <span className="text-[10px] font-light">{numPages} páginas</span>
            <span className="text-[10px] font-light">•</span>
            <span className="text-[10px] font-light">{(props.filename.split('.').pop())?.toUpperCase()}</span>
            <span className="text-[10px] font-light">•</span>
            <span className="text-[10px] font-light">{formatFileSize(props.fileSize)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
