import * as Avatar from "@radix-ui/react-avatar";
import * as Collapsible from '@radix-ui/react-collapsible';
import PatientProfileRecordModal from "../Modal/PatientProfileRecordModal/PatientProfileRecordModal";
import { Badges } from "../Badges/Badges";
import { useEffect, useState } from "react";
import { Option } from "../../interfaces/Option";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyIcon, CameraIcon, PlusIcon, DashIcon } from "@radix-ui/react-icons";
import { Exams } from "../../@types/exams";

type PatientCardProps = {
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
};

const PatientCard: React.FC<PatientCardProps> = ({
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
}) => {
  const [openMoreDiagnosis, setOpenMoreDiagnosis] = useState<boolean>(false);
  const [openMoreExams, setOpenMoreExams] = useState<boolean>(false);
  const [copyArea, setCopyArea] = useState<string>("");

  const uniqueExams: Exams[] = exams.filter((exam, index, self) =>
    index === self.findIndex((e) => e.type_of_exam === exam.type_of_exam)
  );

  useEffect(() => {
    setCopyArea(id);
  }, [id]);

  return (
    <div className="w-[1280px] h-[104px] px-4 py-2 flex items-center bg-white border border-gray-200 rounded-lg">
      <div
        id="animal-patient-card-scroll"
        className="w-full flex items-center border-none rounded-lg overflow-x-scroll"
      >
        <div className="h-20 flex items-center p-2 gap-[24px]">
          <div className="w-[344px] flex gap-4">
            <div className="flex items-center flex-col gap-2">
              <span className="w-[88px] text-lg font-semibold text-brand-standard-black">
                ID:
              </span>
              <div className="h-full flex items-center gap-2">
                <div className="w-[64px] h-6 px-2 bg-brand-standard-black border-none rounded flex items-center">
                  <span className="whitespace-nowrap text-sm font-normal text-white overflow-hidden overflow-ellipsis">
                    {copyArea}
                  </span>
                </div>
                <CopyToClipboard text={copyArea}>
                  <button className="w-6 h-6 flex items-center justify-center hover:border hover:rounded hover:border-gray-200 cursor-pointer">
                    <CopyIcon color="#212529" width={15} height={15} />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="w-[238.6px] h-full flex items-center">
              <PatientProfileRecordModal patientId={id}>
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
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-xl font-semibold text-brand-standard-black">
                        {!name ? "Sem nome" : name}
                      </span>
                    </div>
                    <div className="w-[158.6px] flex">
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis text-lg font-light text-brand-standard-black">
                        {!specie ? race : specie}
                      </span>
                    </div>
                  </div>
                </div>
              </PatientProfileRecordModal>
            </div>
          </div>
          <div className="flex gap-9">
            <div className="flex flex-col gap-2">
              <span className="w-[256px] whitespace-nowrap text-lg font-semibold text-brand-standard-black">
                Dados do paciente:
              </span>
              <div className="w-full flex items-center flex-row gap-2">
                {!gender ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={gender} />
                )}
                {!physical_shape ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={physical_shape} />
                )}
                {!weight ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={weight} />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="whitespace-nowrap text-lg font-semibold text-brand-standard-black">
                Prognóstico:
              </span>
              <div className="w-full flex flex-row gap-2">
                {!prognosis ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={prognosis} />
                )}
              </div>
            </div>
            <div className="flex items-center flex-col gap-2">
              <span className="w-full whitespace-nowrap text-lg font-semibold text-brand-standard-black">
                Diagnóstico / Suspeita Clínica:
              </span>
              <Collapsible.Root
                open={openMoreDiagnosis}
                onOpenChange={setOpenMoreDiagnosis}
                className="w-full flex flex-row items-center"
              >
                {diagnosis.length >= 4 ? (
                  <div className="w-full flex flex-row items-center gap-2">
                    {diagnosis.map((data, index) => {
                      if (index <= 2) {
                        return <Badges key={data.label} data={data.value} />;
                      }
                      return null;
                    })}
                    <Collapsible.Content className="flex flex-row items-center gap-2">
                      {diagnosis.map((data, index) => {
                        if (index >= 3) {
                          return <Badges key={data.label} data={data.value} />;
                        }
                        return null;
                      })}
                    </Collapsible.Content>
                    <Collapsible.Trigger asChild>
                      <button className="w-6 h-6 flex items-center justify-center hover:border hover:rounded hover:border-gray-200 cursor-pointer">
                        {openMoreDiagnosis ? (
                          <DashIcon color="#212529" width={15} height={15} />
                        ) : (
                          <PlusIcon color="#212529" width={15} height={15} />
                        )}
                      </button>
                    </Collapsible.Trigger>
                  </div>
                ) : (
                  <div className="w-full flex flex-row items-center gap-2">
                    {diagnosis.length == 0 ? (
                      <Badges data={"Não identificado"} />
                    ) : (
                      diagnosis.map((data) => (
                        <Badges key={data.label} data={data.value} />
                      ))
                    )}
                  </div>
                )}
              </Collapsible.Root>
            </div>
            <div className="w-full flex items-center flex-col gap-2">
              <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black">
                Exames:
              </span>
              <Collapsible.Root
                open={openMoreExams}
                onOpenChange={setOpenMoreExams}
                className="w-full flex flex-row items-center"
              >
                {exams.length >= 2 ? (
                  <div className="w-full flex flex-row items-center gap-2">
                    {exams.map((data, index) => {
                      if (index == 0) {
                        return (
                          <Badges key={data.id} data={data.type_of_exam} />
                        );
                      }
                      return null;
                    })}
                    <Collapsible.Content className="flex flex-row items-center gap-2">
                      {exams.map((data, index) => {
                        if (index >= 0) {
                          return (
                            <Badges key={data.id} data={data.type_of_exam} />
                          );
                        }
                        return null;
                      })}
                    </Collapsible.Content>
                    <Collapsible.Trigger asChild>
                      <button className="w-6 h-6 flex items-center justify-center hover:border hover:rounded hover:border-gray-200 cursor-pointer">
                        {openMoreDiagnosis ? (
                          <DashIcon color="#212529" width={15} height={15} />
                        ) : (
                          <PlusIcon color="#212529" width={15} height={15} />
                        )}
                      </button>
                    </Collapsible.Trigger>
                  </div>
                ) : (
                  <div className="w-full flex flex-row items-center gap-2">
                    {exams.length == 0 ? (
                      <Badges data={"Não cadastrado"} />
                    ) : (
                      uniqueExams.map((data) => (
                        <Badges key={data.id} data={data.type_of_exam} />
                      ))
                    )}
                  </div>
                )}
              </Collapsible.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
