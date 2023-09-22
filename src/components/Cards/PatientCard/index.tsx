import * as Avatar from "@radix-ui/react-avatar";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Collapsible from "@radix-ui/react-collapsible";
import Badges from "../../Badges";
import PatientProfileRecordModal from "../../Modal/PatientProfileRecordModal";
import { useEffect, useState } from "react";
import { Option } from "../../../interfaces/Option";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyIcon, CameraIcon, PlusIcon, DashIcon } from "@radix-ui/react-icons";
import { Exams } from "../../../@types/exams";

const PatientCard = ({
  id,
  profile_photo,
  name,
  race,
  specie,
  gender,
  weight,
  prognosis,
  diagnosis,
  physical_shape,
  exams,
}: {
  id: string;
  profile_photo?: string;
  name: string;
  race: string;
  specie: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  exams: Exams[];
}) => {
  const [openMoreDiagnosis, setOpenMoreDiagnosis] = useState<boolean>(false);
  const [openMoreExams, setOpenMoreExams] = useState<boolean>(false);
  const [copyArea, setCopyArea] = useState<string>(id);

  useEffect(() => {
    setCopyArea(id);
  }, [id]);

  const uniqueExams: Exams[] = exams.filter(
    (exam, index, self) =>
      index === self.findIndex((e) => e.type_of_exam === exam.type_of_exam)
  );

  const renderBadges = (
    data: string | undefined,
    defaultValue: string,
    key?: number
  ) => <Badges key={key} data={data ?? defaultValue} />;

  const renderExams = (exam: Exams) => (
    <Badges key={exam.id} data={exam.type_of_exam} />
  );

  return (
    <div className="w-[1280px] h-[104px] px-4 py-2 border border-slate-200 rounded-lg">
      <ScrollArea.Root className="w-[1248px] h-[88px] flex items-center overflow-hidden">
        <ScrollArea.Viewport className="w-full border-none rounded-lg">
          <div className="h-20 flex items-center gap-[46px]">
            <div className="w-[344px] flex gap-4">
              <div className="flex items-center flex-col gap-2">
                <span className="w-[88px] text-lg font-semibold text-shark-950">
                  ID:
                </span>
                <div className="h-full flex items-center gap-2">
                  <div className="w-[64px] h-6 px-2 bg-shark-950 border-none rounded flex items-center">
                    <span className="whitespace-nowrap text-sm font-normal text-white overflow-hidden overflow-ellipsis">
                      {copyArea}
                    </span>
                  </div>
                  <CopyToClipboard text={copyArea}>
                    <button className="w-6 h-6 flex items-center justify-center hover:border hover:rounded hover:border-slate-300 cursor-pointer">
                      <CopyIcon color="#475569" width={16} height={16} />
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              <div className="w-[238.6px] h-full flex items-center">
                <PatientProfileRecordModal patientId={id}>
                  <div className="w-full flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center">
                      <Avatar.Root className="w-16 h-16 flex items-center justify-center rounded-full overflow-hidden">
                        <Avatar.Image
                          src={profile_photo}
                          className="w-full h-full object-cover"
                        />
                        <Avatar.Fallback
                          className="w-16 h-16 flex items-center justify-center border border-gray-200 rounded-full overflow-hidden"
                          delayMs={600}
                        >
                          <CameraIcon width={16} height={16} color="#e5e7eb" />
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </div>
                    <div className="w-[158.6px] flex items-center">
                      <div className="w-[158.6px] flex items-center flex-col">
                        <div className="w-[158.6px] flex">
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xl font-semibold text-shark-950">
                            {!name ? "Sem nome" : name}
                          </span>
                        </div>
                        <div className="w-[158.6px] flex">
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis text-lg font-light text-shark-950">
                            {!specie ? race : specie}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PatientProfileRecordModal>
              </div>
            </div>
            <div className="flex gap-9">
              <div className="flex flex-col gap-2">
                <span className="w-[256px] whitespace-nowrap text-lg font-semibold text-shark-950">
                  Dados do paciente:
                </span>
                <div className="w-full flex items-center flex-row gap-2">
                  {renderBadges(gender, "Não cadastrado")}
                  {renderBadges(physical_shape, "Não cadastrado")}
                  {renderBadges(weight, "Não cadastrado")}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="whitespace-nowrap text-lg font-semibold text-shark-950">
                  Prognóstico:
                </span>
                <div className="w-full flex flex-row gap-2">
                  {renderBadges(prognosis, "Não cadastrado")}
                </div>
              </div>
              <div className="flex items-center flex-col gap-2">
                <span className="w-full whitespace-nowrap text-lg font-semibold text-shark-950">
                  Diagnóstico / Suspeita clínica:
                </span>
                <Collapsible.Root
                  open={openMoreDiagnosis}
                  onOpenChange={setOpenMoreDiagnosis}
                  className="w-full flex flex-row items-center"
                >
                  {diagnosis.length >= 4 ? (
                    <div className="w-full flex flex-row items-center gap-2">
                      {diagnosis
                        .slice(0, 3)
                        .map((data, i) => renderBadges(data.value, "", i))}
                      <Collapsible.Content className="flex flex-row items-center gap-2">
                        {diagnosis
                          .slice(3)
                          .map((data, i) => renderBadges(data.value, "", i))}
                      </Collapsible.Content>
                      <Collapsible.Trigger asChild>
                        <button className="w-6 h-6 flex items-center justify-center hover:border hover:rounded hover:border-slate-300 cursor-pointer">
                          {openMoreDiagnosis ? (
                            <DashIcon color="#64748b" width={16} height={16} />
                          ) : (
                            <PlusIcon color="#64748b" width={16} height={16} />
                          )}
                        </button>
                      </Collapsible.Trigger>
                    </div>
                  ) : (
                    <div className="w-full flex flex-row items-center gap-2">
                      {diagnosis.length === 0 ? (
                        <Badges data={"Não cadastrado"} />
                      ) : (
                        diagnosis.map((data, i) =>
                          renderBadges(data.value, "", i)
                        )
                      )}
                    </div>
                  )}
                </Collapsible.Root>
              </div>
              <div className="w-full flex items-center flex-col gap-2">
                <span className="whitespace-nowrap w-full text-lg font-semibold text-shark-950">
                  Exames:
                </span>
                <Collapsible.Root
                  open={openMoreExams}
                  onOpenChange={setOpenMoreExams}
                  className="w-full flex flex-row items-center"
                >
                  {exams.length >= 2 ? (
                    <div className="w-full flex flex-row items-center gap-2">
                      {exams.slice(0, 1).map(renderExams)}
                      <Collapsible.Content className="flex flex-row items-center gap-2">
                        {exams.slice(1).map(renderExams)}
                      </Collapsible.Content>
                      <Collapsible.Trigger asChild>
                        <button className="w-6 h-6 flex items-center justify-center hover:border hover:rounded hover:border-gray-200 cursor-pointer">
                          {openMoreExams ? (
                            <DashIcon color="#212529" width={15} height={15} />
                          ) : (
                            <PlusIcon color="#212529" width={15} height={15} />
                          )}
                        </button>
                      </Collapsible.Trigger>
                    </div>
                  ) : (
                    <div className="w-full flex flex-row items-center gap-2">
                      {exams.length === 0 ? (
                        <Badges data={"Não cadastrado"} />
                      ) : (
                        uniqueExams.map(renderExams)
                      )}
                    </div>
                  )}
                </Collapsible.Root>
              </div>
            </div>
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="horizontal"
          className="flex data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-[6px]"
        >
          <ScrollArea.Thumb className="flex-1 hover:bg-slate-300 rounded-[50px]" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};

export default PatientCard;
