import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import EditPatientSurgeryModal from '../../Modal/EditPatientSurgeryModal';
import DeleteSurgeryModal from '../../Modal/DeleteSurgeryModal';

type SurgeryItemProps = {
  id: string;            
  username: string;        
  name_of_surgery: string; 
  risk_level: string;      
  execution_date: string;  
  duration: string;        
  period: string;          
  notes: string;           
  createdAt: Date;       
  updatedAt: Date;       
}

const SurgeryItem: React.FC<SurgeryItemProps> = ({
  id,
  username,
  name_of_surgery,
  risk_level,
  execution_date,
  duration,
  period,
  notes,
  createdAt,
  updatedAt,
}) => {
  const formattedCreatedAt = createdAt ? format(new Date(createdAt), "dd/MM/yy", { locale: locale.ptBR }) : "";
  const formattedTimeItCreated = createdAt ? format(new Date(createdAt), "HH:mm", { locale: locale.ptBR }) : "";
  const formattedExecutionDate = execution_date ? format(new Date(execution_date), "dd/MM/yy", { locale: locale.ptBR }) : "";

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
      <div className="w-full flex flex-col mb-[13px]">
        <span className="font-normal text-xs text-slate-500">
          Nome da cirurgia / procedimento
        </span>
        <span className="font-semibold text-2xl text-slate-700">
          {name_of_surgery}
        </span>
      </div>
      <div className="w-full flex flex-row mb-[13px]">
        <div className="w-[196px] flex flex-col">
          <span className="font-normal text-xs text-slate-500">
            Nível de risco da operação
          </span>
          <span className="font-semibold text-base text-slate-700">
            {risk_level}
          </span>
        </div>
        <div className="flex flex-row gap-[26px]">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Data da operação
            </span>
            <span className="font-semibold text-base text-slate-700">
              {formattedExecutionDate}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Duração da cirurgia
            </span>
            <span className="font-semibold text-base text-slate-700">
              {duration}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">Período</span>
            <span className="font-semibold text-base text-slate-700">
              {period}
            </span>
          </div>
        </div>
      </div>
      {notes && (
        <div className="w-full flex flex-row mb-[13px]">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500 mb-[6px]">
              Descrição do tratamento
            </span>
            <p className="whitespace-pre-line font-normal text-sm text-slate-700">{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

type OptionsProps = {
  id: string;
}

const Options = ({ id: surgeryId }: OptionsProps) => {
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
              <EditPatientSurgeryModal id={surgeryId} />
            </li>
            <li className="p-1 first:pt-0 last:pb-0">
              <DeleteSurgeryModal id={surgeryId} />
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default SurgeryItem;