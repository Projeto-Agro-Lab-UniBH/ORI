import * as Avatar from "@radix-ui/react-avatar";
import * as Dialog from "@radix-ui/react-dialog";
import { CopyIcon, PlusIcon, ImageIcon } from "@radix-ui/react-icons";

import { Badges } from "../Badges/Badges";

type AnimalPatientCardProps = {
  id: string;
  name: string;
  specie: string;
  photo: string;
  animal_type: string;
  physical_shape: string;
  genre: string;
  weight: string;
  situation: string;
  diagnosis: Array<string>;
  exams: Array<string>;
};

export function AnimalPatientCard(props: AnimalPatientCardProps) {
  return (
    <div className="w-full h-[104px] px-4 pt-2 pb-2 flex items-center bg-white border border-gray-200 rounded-lg">
      <div
        id="animal-patient-card-scroll"
        className="w-full flex items-center border-none rounded-lg overflow-x-scroll"
      >
        <div className="h-20 flex items-center p-2 gap-10">
          <div className="w-[224px] flex items-center flex-col">
            <span className="w-full mb-2 text-lg font-semibold text-brand-standard-black">
              ID:
            </span>
            <div className="w-full h-full flex items-center gap-2">
              <div className="w-[180px] h-6 bg-brand-standard-black border-none rounded flex items-center px-2">
                <span className="whitespace-nowrap text-sm font-normal text-white overflow-hidden overflow-ellipsis">
                  {props.id}
                </span>
              </div>
              <button className="w-6 h-6 flex items-center justify-center border-none rounded bg-none hover:bg-gray-100">
                <CopyIcon color="#212529" />
              </button>
            </div>
          </div>
          <div className="w-full h-full mx-6 flex items-center">
            <Dialog.Trigger className="w-full flex items-center hover:cursor-pointer gap-4">
              <div className="w-16 h-16 flex items-center">
                <Avatar.Root className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                  {props.photo != "" ? (
                    <Avatar.Image
                      className="w-full h-full object-cover"
                      src={props.photo}
                    />
                  ) : (
                    <ImageIcon color="#ffff" width={24} height={24} />
                  )}
                  <Avatar.Fallback />
                </Avatar.Root>
              </div>
              <div className="w-full flex items-center max-w-[164px]">
                <div className="w-full max-w-[164px] flex items-center flex-col">
                  <p className="w-full flex whitespace-nowrap text-xl font-semibold text-brand-standard-black overflow-hidden text-ellipsis">
                    {props.name != "" ? props.name : "Sem nome"}
                  </p>
                  <p className="w-full flex whitespace-nowrap text-lg font-light text-brand-standard-black overflow-hidden text-ellipsis">
                    {props.specie != ""
                      ? props.specie
                      : "Raça não identificada"}
                  </p>
                </div>
              </div>
            </Dialog.Trigger>
          </div>
          <div className="w-full flex items-center flex-col">
            <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">
              Ficha do animal:
            </span>
            <div className="w-full flex items-center flex-row gap-2">
              {props.animal_type != "" ? (
                <Badges data={props.animal_type} />
              ) : (
                <span className="whitespace-nowrap text-sm font-normal text-brand-standard-black">
                  Sem dados cadastrados
                </span>
              )}
              {props.genre != "" ? <Badges data={props.genre} /> : null}
              {props.physical_shape != "" ? (
                <Badges data={props.physical_shape} />
              ) : null}
              {props.weight != "" ? <Badges data={props.weight} /> : null}
            </div>
          </div>
          <div className="w-full flex items-center flex-col">
            <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">
              Situação:
            </span>
            <div className="w-full flex items-center flex-row gap-2">
              {props.situation != "" ? (
                <Badges data={props.situation} />
              ) : (
                <span className="whitespace-nowrap text-sm font-normal text-brand-standard-black">
                  Sem dados cadastrados
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex items-center flex-col">
            <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">
              Diagnóstico:
            </span>
            <div className="w-full flex items-center flex-row gap-2">
              {props.diagnosis.map((data) =>
                data != "" ? (
                  <Badges key={props.id} data={data} />
                ) : (
                  <span className="whitespace-nowrap text-sm font-normal text-brand-standard-black">
                    Sem dados cadastrados
                  </span>
                )
              )}
            </div>
          </div>
          <div className="w-full flex items-center flex-col">
            <span className="whitespace-nowrap w-full text-lg font-semibold text-brand-standard-black mb-2">
              Exames:
            </span>
            <div className="w-full flex items-center flex-row gap-2">
              {props.exams.map((data) =>
                data != "" ? (
                  <Badges key={props.id} data={data} />
                ) : (
                  <span className="whitespace-nowrap text-sm font-normal text-brand-standard-black">
                    Sem dados cadastrados
                  </span>
                )
              )}
              {/* <button className="w-6 h-6 flex items-center justify-center bg-none border-none rounded hover:bg-gray-100">
              <PlusIcon color="#212529" />
            </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
