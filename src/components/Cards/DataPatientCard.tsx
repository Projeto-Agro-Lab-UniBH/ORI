import * as Avatar from "@radix-ui/react-avatar";
import { CopyIcon, CameraIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import EditPatientProfileModal from "../Modal/EditPatientProfileModal";
import { Badges } from "../Badges/Badges";
import { Option } from "../../interfaces/Option";

type DataPatientCardProps = {
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
  exams: Array<string>;
};

const DataPatientCard = (props: DataPatientCardProps) => {
  const [copyArea, setCopyArea] = useState("");

  useEffect(() => {
    setCopyArea(props.id);
  }, [props.id]);

  return (
    <div className="w-full h-[104px] px-4 pt-2 pb-2 flex items-center bg-white border border-gray-200 rounded-lg">
      <div
        id="animal-patient-card-scroll"
        className="w-full flex items-center border-none rounded-lg overflow-x-scroll"
      >
        <div className="h-20 flex items-center p-2 gap-[24px]">
          <div className="w-[344px] flex gap-4">
            <div className="w-[88px] flex items-center flex-col">
              <span className="w-[88px] mb-2 text-lg font-semibold text-brand-standard-black">
                ID:
              </span>
              <div className="w-[88px] h-full flex items-center gap-2">
                <div className="w-[64px] h-6 bg-brand-standard-black border-none rounded flex items-center px-2">
                  <span className="whitespace-nowrap text-sm font-normal text-white overflow-hidden overflow-ellipsis">
                    {copyArea}
                  </span>
                </div>
                <CopyToClipboard text={copyArea}>
                  <button className="w-6 h-6 flex items-center justify-center border-none rounded bg-none hover:bg-slate-50">
                    <CopyIcon color="#212529" />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="w-[238.6px] h-full flex items-center">
              <EditPatientProfileModal patientId={props.id}>
                <div className="w-16 h-16 flex items-center">
                  <Avatar.Root
                    className={
                      !props.profile_photo
                        ? "w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                        : "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                    }
                  >
                    {!props.profile_photo ? (
                      <div className="w-4 h-4">
                        <CameraIcon
                          className="w-full h-full object-cover"
                          color="#e5e7eb"
                        />
                      </div>
                    ) : (
                      <Avatar.Image
                        className="w-full h-full object-cover"
                        src={props.profile_photo}
                      />
                    )}
                  </Avatar.Root>
                </div>
                <div className="w-[158.6px] flex items-center">
                  <div className="w-[158.6px] flex items-center flex-col">
                    <div className="w-[158.6px] flex">
                      <p className="whitespace-nowrap overflow-hidden text-ellipsis text-xl font-semibold text-brand-standard-black">
                        {!props.name ? "Sem nome" : props.name}
                      </p>
                    </div>
                    <div className="w-[158.6px] flex">
                      <p className="whitespace-nowrap overflow-hidden text-ellipsis text-lg font-light text-brand-standard-black">
                        {!props.specie ? "Não registrado" : props.specie}
                      </p>
                    </div>
                  </div>
                </div>
              </EditPatientProfileModal>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="w-[256px] flex items-center flex-col">
              <span className="w-[256px] whitespace-nowrap text-lg font-semibold text-brand-standard-black mb-2">
                Dados do paciente:
              </span>
              <div className="w-full flex items-center flex-row gap-2">
                {!props.gender ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={props.gender} />
                )}
                {!props.physical_shape ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={props.physical_shape} />
                )}
                {!props.weight ? (
                  <Badges data={"Não registrado"} />
                ) : (
                  <Badges data={props.weight} />
                )}
              </div>
            </div>
            <div className="w-[124px] flex items-center flex-col">
              <span className="w-[124px] whitespace-nowrap text-lg font-semibold text-brand-standard-black mb-2">
                Prognóstico:
              </span>
              <div className="w-full flex items-center flex-row gap-2">
                <Badges
                  data={!props.prognosis ? "Não registrado" : props.prognosis}
                />
              </div>
            </div>
            <div className="w-full flex items-center flex-col">
              <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">
                Diagnóstico / Suspeita Clínica:
              </span>
              <div className="w-full flex items-center flex-row gap-2">
                {props.diagnosis.length == 0 ? (
                  <Badges data={"Não identificado"} />
                ) : (
                  props.diagnosis.map((data) => (
                    <Badges key={data.label} data={data.value} />
                  ))
                )}
              </div>
            </div>
            <div className="w-full flex items-center flex-col">
              <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">
                Exames:
              </span>
              <div className="w-full flex items-center flex-row gap-2">
                {props.exams.map((data) =>
                  !data ? (
                    <Badges data={"Não registrado"} />
                  ) : (
                    <Badges key={props.id} data={data} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPatientCard;
