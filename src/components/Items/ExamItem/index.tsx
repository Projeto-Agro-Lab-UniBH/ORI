import { DotsHorizontalIcon, DownloadIcon } from "@radix-ui/react-icons";
import EditPatientExamModal from "../../Modal/EditPatientExamModal";
import { Option } from "../../../interfaces/Option";
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DeleteExamModal from "../../Modal/DeleteExamModal";

type ExamItemProps = {
  id: string;
  username: string;
  execution_date: string;
  runtime: string;
  execution_period: string;
  responsible_person: string;
  type_of_exam: string;
  exam_name: string;
  diagnosis: Option[];
  prognosis: string;
  description_of_treatment: string;
  createdAt: Date;
  updatedAt: Date;
};

const ExamItem: React.FC<ExamItemProps> = ({
  id,
  username,
  execution_date,
  runtime,
  execution_period,
  responsible_person,
  type_of_exam,
  exam_name,
  diagnosis,
  prognosis,
  description_of_treatment,
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
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-row mb-[13px] justify-between">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Nome do exame
            </span>
            <span className="font-semibold text-2xl text-slate-700">
              {exam_name}
            </span>
          </div>
          <div className="w-[432px] flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Nome do responsável
            </span>
            <span className="font-semibold text-lg text-slate-700">
              {responsible_person}
            </span>
          </div>
        </div>
        <div className="w-full flex flex-row mb-[13px] justify-between">
          <div className="flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Tipo de exame
            </span>
            <span className="font-semibold text-base text-slate-700">
              {type_of_exam}
            </span>
          </div>
          <div className="w-[432px] flex flex-row gap-6">
            <div className="flex flex-col">
              <span className="font-normal text-xs text-slate-500">
                Data de realização
              </span>
              <span className="font-semibold text-base text-slate-700">
                {formattedExecutionDate}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-normal text-xs text-slate-500">
                Tempo de execução
              </span>
              <span className="font-semibold text-base text-slate-700">
                {runtime}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-normal text-xs text-slate-500">
                Período
              </span>
              <span className="font-semibold text-base text-slate-700">
                {execution_period}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row mb-[13px] justify-between">
          {diagnosis && (
            <div className="w-[204px] flex flex-col">
              <span className="font-normal text-xs text-slate-500">
                Diagnóstico / Suspeita Clínica
              </span>
              <ul className="font-semibold text-base text-slate-700">
                {diagnosis.map((data, i) => (
                  <li key={i} className="break-words">{data.value}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="w-[432px] flex flex-col">
            <span className="font-normal text-xs text-slate-500">
              Prognóstico
            </span>
            <span className="font-semibold text-base text-slate-700">
              {prognosis}
            </span>
          </div>
        </div>
        {description_of_treatment && (
          <div className="w-full flex flex-row mb-[13px]">
            <div className="flex flex-col">
              <span className="font-normal text-xs text-slate-500 mb-[6px]">
                Descrição do tratamento
              </span>
              <p className="whitespace-pre-line font-normal text-sm text-slate-700">
                {description_of_treatment}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamItem;

type OptionsProps = {
  id: string;
}

const Options = ({ id: examId }: OptionsProps) => {
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
              <EditPatientExamModal id={examId} />
            </li>
            <li className="p-1 first:pt-0 last:pb-0">
              <DeleteExamModal id={examId} />
            </li>
          </ul>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}