import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import EditPatientReportModal from "../../Modal/EditPatientReportModal";
import DeleteReportModal from "../../Modal/DeleteReportModal";

type ReportItemProps = {
  id: string;
  username: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReportItem = ({
  id,
  username,
  title,
  text,
  createdAt,
  updatedAt,
}: ReportItemProps) => {
  const formattedCreatedAt = createdAt ? format(new Date(createdAt), 'dd/MM/yy', { locale: locale.ptBR }) : '';
  const formattedTimeItCreated = createdAt ? format(new Date(createdAt), 'HH:mm', { locale: locale.ptBR }) : '';

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row justify-between items-center mb-[13px]">
        <div className="w-full flex flex-col">
          <span className="font-normal text-xs text-slate-500 mb-1">
            Informações de quem fez a postagem
          </span> 
          <div className="w-full flex flex-row items-center text-center gap-1">
            <span className="font-medium text-base text-slate-700">
              {username}
            </span>
            {createdAt && (
              <>
                <span className="text-[10px] leading-6 font-light text-slate-400">
                  •
                </span>
                <span className="font-base text-sm leading-6 text-slate-400">
                  {formattedCreatedAt}
                </span>
                <span className="text-[10px] leading-6 font-light text-slate-400">
                  •
                </span>
                <span className="font-base text-sm leading-6 text-slate-400">
                  {formattedTimeItCreated}
                </span>
              </>
            )}
            {updatedAt !== createdAt && (
              <>
                <span className="text-[10px] leading-6 font-light text-slate-400">
                  •
                </span>
                <span className="font-base text-sm leading-6 text-slate-400">
                  Editado
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Options id={id} />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col mb-[13px]">
          <span className="font-normal text-xs text-slate-500">
            Título
          </span>  
          <span className="break-words font-semibold text-2xl text-slate-700">
            {title}
          </span>
        </div>
        <div className="w-full flex flex-col">
          <span className="font-normal text-xs text-slate-500 mb-[6px]">
            Texto do relatório
          </span> 
          <p className="whitespace-pre-line font-normal text-sm text-slate-700">
            {text}
          </p>    
        </div>
      </div>
    </div>
  );
};

export default ReportItem;

type OptionsProps = {
  id: string;
}

const Options = ({ id: reportId }: OptionsProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          <DotsHorizontalIcon width={18} height={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-20 border rounded-md flex flex-col bg-white shadow-md z-10 py-2 px-2">
          <ul role="list" className="divide-y divide-slate-200">
            <li className="p-1 first:pt-0 last:pb-0">
              <EditPatientReportModal id={reportId} />
            </li>
            <li className="p-1 first:pt-0 last:pb-0">
              <DeleteReportModal id={reportId} />
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}