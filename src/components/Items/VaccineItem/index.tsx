import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import EditPatientVaccineModal from "../../Modal/EditPatientVaccineModal";
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import DeleteVaccineModal from '../../Modal/DeleteVaccineModal';

type VaccineItemProps = {
  id: string;
  username: string; 
  vaccine: string;
  date_of_vaccination: string;
  revaccination_date: string;
  name_of_veterinarian: string;
  vaccine_code: string;
  age: string;
  createdAt: Date;       
  updatedAt: Date;
}

const VaccineItem: React.FC<VaccineItemProps> = ({
  id,
  username,
  vaccine,
  date_of_vaccination,
  revaccination_date,
  name_of_veterinarian,
  vaccine_code,
  age,
  createdAt,
  updatedAt,
}) => {
  const formattedCreatedAt = createdAt ? format(new Date(createdAt), "dd/MM/yy", { locale: locale.ptBR }) : "";
  const formattedTimeItCreated = createdAt ? format(new Date(createdAt), "HH:mm", { locale: locale.ptBR }) : "";
  
  const formattedDateOfVaccination = date_of_vaccination ? format(new Date(date_of_vaccination), "dd/MM/yy", { locale: locale.ptBR }) : "";
  const formattedRevaccinationDate = revaccination_date ? format(new Date(revaccination_date), "dd/MM/yy", { locale: locale.ptBR }) : "";

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
        <span className="font-normal text-xs text-slate-500">Vacina</span>
        <span className="font-semibold text-2xl text-slate-700">
         {vaccine}
        </span>
      </div>
      <div className="w-full flex flex-row mb-[13px] gap-5">
        {vaccine_code && (
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Código da vacina
            </span>
            <span className="font-semibold text-base text-slate-700">
              {vaccine_code}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-normal text-xs text-slate-500">
            Data de vacinação
          </span>
          <span className="font-semibold text-base text-slate-700">
            {formattedDateOfVaccination}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-normal text-xs text-slate-500">
            Data de revacinação
          </span>
          <span className="font-semibold text-base text-slate-700">
            {revaccination_date ? formattedRevaccinationDate : "Sem definição"}
          </span>
        </div>
        {age && (
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Idade do vacinado
            </span>
            <span className="font-semibold text-base text-slate-700">{age}</span>
          </div>
        )}
      </div>
      <div className="w-full flex flex-row mb-[13px]">
        <div className="w-full flex flex-col">
          <span className="font-normal text-xs text-slate-500">
            Nome do médico veterinário
          </span>
          <span className="font-semibold text-base text-slate-700">
            {name_of_veterinarian}
          </span>
        </div>
      </div>
    </div>
  );
};

type OptionsProps = {
  id: string;
}

const Options = ({ id: vaccineId }: OptionsProps) => {
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
              <EditPatientVaccineModal id={vaccineId} />
            </li>
            <li className="p-1 first:pt-0 last:pb-0">
              <DeleteVaccineModal id={vaccineId} />
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default VaccineItem;