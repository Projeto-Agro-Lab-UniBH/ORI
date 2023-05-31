import { useState } from 'react';
import AddAttachmentModal from '../Modal/AddAttachmentModal';
import { FileTextIcon } from '@radix-ui/react-icons';

type PatientAttachmentsProps = {
	patiendId: string;
	isOpen: boolean;
};

const PatientAttachments = (props: PatientAttachmentsProps) => {
	const [files, setFiles] = useState<FileList>({} as FileList);

	return (
		<div id="modal-scroll" className="w-full h-[488px] px-6 py-6 overflow-y-scroll">
			<div className="w-full flex flex-col items-center gap-6">
				<div className="w-full flex justify-start">
					<AddAttachmentModal patientId={props.patiendId} setFiles={setFiles} files={files} />
				</div>
				<div className="w-full grid grid-cols-4 gap-[28px]">
					{Array.from(files).map((file, i) => (
						<div key={i} className="w-[146px] h-[146px] border rounded border-gray-200 flex items-center justify-center flex-col">
							<FileTextIcon key={i} height={100} width={100} />
							{file.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PatientAttachments;
