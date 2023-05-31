import Link from 'next/link';
import EditReportModal from '../Modal/EditReportModal';
import { DownloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { api } from '../../providers/Api';

type ReportCardProps = {
	id: string;
	patientId: string;
	shift: string;
	author: string;
	report_text: string;
	createdAt: string;
	updatedAt: string;
	attachments: string;
};

const ReportCard = (props: ReportCardProps) => {
	const [download, setDownload] = useState<any>({} as any);
	useEffect(() => {
		if (props?.attachments) {
			(async () => {
				const response = await api.get(`files/get-file-by-name/${props.attachments}`);
				const downloadLink = document.createElement('a');
				downloadLink.href = `data:application/pdf;base64,${response.data}`;
				downloadLink.download = `${props?.attachments}`;
				setDownload(downloadLink);
			})();
		}
	}, [props]);
	return (
		<div className="w-full flex flex-col items-center gap-6">
			<div className="w-full flex flex-col items-center gap-3 pb-6 border-b border-gray-200">
				<div className="w-full flex flex-col items-center gap-2">
					<div className="w-full flex flex-row items-center justify-between">
						<div className="w-[504px] items-center flex">
							<span className="w-[504px] whitespace-nowrap text-2xl text-brand-standard-black font-semibold overflow-hidden text-ellipsis">{props.shift}</span>
						</div>
						<div className="flex items-center gap-4">
							<EditReportModal id={props.id} patientId={props.patientId} />
						</div>
					</div>
					<div className="w-full font-light text-brand-standard-black">{props.author}</div>
					<div className="w-full flex-row flex justify-between items-center">
						<div className="w-full flex-row flex items-center gap-5">
							<div className="flex items-center gap-1">
								<span className="text-sm text-brand-standard-black font-semibold">Data de realização do exame:</span>
								<p className="text-base font-normal text-brand-standard-black">{props.createdAt}</p>
							</div>
							<div className="flex items-center gap-1">
								<span className="text-sm text-brand-standard-black font-semibold">Data da última edição:</span>
								<p className="text-base font-normal text-brand-standard-black">{props.updatedAt}</p>
							</div>
						</div>
					</div>
					<div className="w-full flex items-center">
						<button
							// href={download}
							// download={props?.attachments}
							onClick={() => download.click()}
							className="px-1 py-1 border-none rounded hover:bg-gray-50 flex items-center text-brand-standard-black font-semibold gap-1"
						>
							<DownloadIcon /> Anexado
						</button>
						{props.attachments}
					</div>
				</div>
				<div className="w-full">
					<p className="text-base font-normal text-brand-standard-black">{props.report_text}</p>
				</div>
			</div>
		</div>
	);
};

export default ReportCard;
