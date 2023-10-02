import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import DeleteHospitalizationModal from '../../Modal/DeleteHospitalizationModal';
import EditPatientHospitalizationModal from '../../Modal/EditPatientHospitalizationModal';

type HospitalizationItemProps = {
  id: string;
  username: string;
  reason: string;
  prognosis: string;      
  entry_date: string;     
  departure_date: string; 
  notes: string;          
  createdAt: Date;      
  updatedAt: Date;
}

const HospitalizationItem: React.FC<HospitalizationItemProps> = ({ 
  id,
  username,
  reason,           
  prognosis,      
  entry_date,     
  departure_date, 
  notes,          
  createdAt,      
  updatedAt,       
}) => {
  const formattedCreatedAt = createdAt ? format(new Date(createdAt), "dd/MM/yy", { locale: locale.ptBR }) : "";
  const formattedTimeItCreated = createdAt ? format(new Date(createdAt), "HH:mm", { locale: locale.ptBR }) : "";

  const formattedEntryDate = entry_date ? format(new Date(entry_date), "dd/MM/yy", { locale: locale.ptBR }) : "";
  const formattedDepartureDate = departure_date ? format(new Date(departure_date), "dd/MM/yy", { locale: locale.ptBR }) : "";

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-row justify-between items-center">
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
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Motivo da internação
            </span>
            <span className="font-semibold text-base text-slate-700">
              {reason}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Prognóstico
            </span>
            <span className="font-semibold text-base text-slate-700">
              {prognosis}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Data de entrada
            </span>
            <span className="font-semibold text-base text-slate-700">
              {formattedEntryDate}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Data de saída
            </span>
            <span className="font-semibold text-base text-slate-700">
              {!formattedDepartureDate ? "Sem previsão" : formattedDepartureDate}
            </span>
          </div>
        </div>
      </div>
      {notes && (
        <div className="w-full">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500 mb-[6px]">
              Descrição do tratamento
            </span>
            <span className="whitespace-pre-line font-normal text-sm text-slate-700">
              {notes} 
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalizationItem;

type OptionsProps = {
  id: string;
}

const Options = ({ id }: OptionsProps) => {
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
              <EditPatientHospitalizationModal id={id} />
            </li>
            <li className="p-1 first:pt-0 last:pb-0">
              <DeleteHospitalizationModal id={id} />
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}