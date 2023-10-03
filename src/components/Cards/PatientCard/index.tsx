import * as Avatar from "@radix-ui/react-avatar";
import Badges from "../../Badges";
import PatientProfileRecordModal from "../../Modal/PatientProfileRecordModal";
import { CameraIcon } from "@radix-ui/react-icons";

type PatientCardProps = {
  id: string;
  profile_photo?: string;
  name: string;
  race: string;
  specie: string;
  gender: string;
  physical_shape: string;
  current_weight: string;
  status: string;
  _count: {
    vaccines: number,
    exams: number,
    surgery: number,
    hospitalizations: number,
    reports: number
  }
}

const PatientCard = ({
  id,
  profile_photo,
  name,
  race,
  specie,
  gender,
  physical_shape,
  current_weight,
  status,
  _count: {
    vaccines,
    exams,
    surgery,
    hospitalizations,
    reports
  }
}: PatientCardProps) => {
  const renderBadges = (
    data: string | number | undefined,
    defaultValue: string,
    key?: number
  ) => <Badges key={key} data={data ?? defaultValue} />;

  return (
    <div className="w-[1280px] px-4 border border-slate-200 rounded-lg">
      <div className="w-[1248px] h-[88px] flex items-center overflow-hidden">
        <div className="w-full h-20 flex items-center gap-[46px]">
          <div className="w-[216px] flex gap-3">
            <div className="w-[216px] h-full flex items-center">
              <PatientProfileRecordModal patientId={id}>
                <div className="w-[216px] flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center">
                    <Avatar.Root className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden">
                      <Avatar.Image
                        src={profile_photo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <Avatar.Fallback
                        className="w-14 h-14 flex items-center justify-center border border-slate-200 rounded-full overflow-hidden"
                        delayMs={600}
                      >
                        <CameraIcon width={16} height={16} className="text-slate-200" />
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </div>
                  <div className="w-[172px] flex items-center">
                    <div className="w-[172px] flex items-center flex-col">
                      <div className="w-[172px] flex">
                        <span className="max-w-[172px] whitespace-nowrap overflow-hidden text-ellipsis text-xl font-semibold text-slate-800">
                          {!name ? "Sem nome" : name}
                        </span>
                      </div>
                      <div className="w-[172px] flex">
                        <span className="max-w-[172px] whitespace-nowrap overflow-hidden text-ellipsis text-lg font-light text-slate-600">
                          {!specie ? race : specie}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PatientProfileRecordModal>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap font-semibold text-lg text-slate-800">
                Sexo
              </span>
              <div className="w-full flex flex-row gap-2">
                {renderBadges(gender, "Não cadastrado")}
              </div>
            </div>
            <div className="w-16 flex flex-col gap-2">
              <span className="w-16 whitespace-nowrap font-semibold text-lg text-slate-800">
                Peso
              </span>
              <div className="w-16 flex flex-row gap-2">
                {renderBadges(current_weight, "Não cadastrado")}
              </div>
            </div>
            <div className="w-[118px] flex flex-col gap-2">
              <span className="w-[118px] whitespace-nowrap font-semibold text-lg text-slate-800">
                Porte físico
              </span>
              <div className="w-[118px] flex flex-row gap-2">
                {renderBadges(physical_shape, "Não cadastrado")}
              </div>
            </div>
            <div className="w-[108px] flex justify-center items-center">
              <div className="flex flex-col gap-2">
                <span className=" whitespace-nowrap font-semibold text-lg text-slate-800">
                  Status
                </span>
                <div className=" flex flex-row gap-2">
                  {renderBadges(status, "Sem status")}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap font-semibold text-lg text-slate-800">
                Vacinas
              </span>
              <div className="flex flex-row gap-2">
                {renderBadges(vaccines, "0")}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap font-semibold text-lg text-slate-800">
                Exames
              </span>
              <div className="w-full flex flex-row gap-2">
                {renderBadges(exams, "0")}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap font-semibold text-lg text-slate-800">
                Cirurgias
              </span>
              <div className="w-full flex flex-row gap-2">
                {renderBadges(surgery, "0")}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap font-semibold text-lg text-slate-800">
                Internações
              </span>
              <div className="w-full flex flex-row gap-2">
                {renderBadges(hospitalizations, "0")}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap font-semibold text-lg text-slate-800">
                Relatórios
              </span>
              <div className="w-full flex flex-row gap-2">
                {renderBadges(reports, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
