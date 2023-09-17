import * as Avatar from "@radix-ui/react-avatar";
import { CameraIcon } from "@radix-ui/react-icons";
import PatientProfileRecordModal from "../../Modal/PatientProfileRecordModal";

const SearchPatientResultItem = ({
  id,
  src,
  name,
  race,
  specie,
}: {
  id: string;
  src?: string;
  name: string;
  specie?: string;
  race?: string;
}) => {
  return (
    <PatientProfileRecordModal key={id} patientId={id}>
      <div className="w-full flex flex-row items-center gap-4">
        <div className="w-12 h-12">
          <Avatar.Root className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
            <Avatar.Image src={src} className="w-full h-full object-cover" />
            <Avatar.Fallback
              className="w-12 h-12 border border-gray-200 flex items-center justify-center rounded-full overflow-hidden"
              delayMs={600}
            >
              <CameraIcon color="#e5e7eb" width={14} height={14} />
            </Avatar.Fallback>
          </Avatar.Root>
        </div>
        <div className="w-full flex flex-col">
          <span className="max-w-[502.4px] flex whitespace-nowrap overflow-hidden text-ellipsis text-base font-semibold text-shark-950">
            {name}
          </span>
          {!specie && race != null ? undefined : (
            <span className="max-w-[502.4px] flex whitespace-nowrap overflow-hidden text-ellipsis text-base font-light text-shark-950">
              {specie}
            </span>
          )}
          {!race && specie != null ? undefined : (
            <span className="max-w-[502.4px] whitespace-nowrap overflow-hidden text-ellipsis text-base font-light text-shark-950">
              {race}
            </span>
          )}
        </div>
      </div>
    </PatientProfileRecordModal>
  );
};

export default SearchPatientResultItem;
