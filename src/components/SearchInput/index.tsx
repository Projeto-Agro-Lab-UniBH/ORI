import * as Dialog from "@radix-ui/react-dialog";
import DotsLoad from "../Load/DotsLoad";
import VerticalScrollbarContainer from "../Scrollbar/VerticalScrollbar";
import SearchPatientResultItem from "../Items/SearchPatientResultItem";
import { api } from "../../providers/Api";
import { useQuery } from "react-query";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { SearchPatientResponse } from "../../@types/ApiResponse";

const SearchInput = ({ 
  value, 
  setValue,
  onChange 
}:{
  value: string; 
  setValue: Dispatch<SetStateAction<string>>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data } = useQuery<SearchPatientResponse[]>(
    ["searchByInputValue", value],
    async () => {
      setIsLoading(true);
      const response = await api.get<SearchPatientResponse[]>(
        `/patient/search/by/values?search=${value || ""}`
      );
      setIsLoading(false);
      return response.data;
    },
    {
      enabled: value !== "", // Ativa a busca assim que algo for digitado
      refetchOnReconnect: false,
    }
  )

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger className="w-[592px] h-10 border border-slate-300 rounded px-3 p-3 gap-2 flex items-center hover:hover:border-slate-400 hover:bg-slate-200/20 focus:outline-none">
        <MagnifyingGlassIcon color="#94a3b8" width={16} height={16} />
        <span className="text-sm text-slate-400">Pesquisar um paciente</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 inset-0 fixed z-10" />
        <Dialog.Content className="w-[592px] rounded border-none fixed overflow-hidden top-12 left-1/2 -translate-x-1/2 z-10">
          <div className="w-full flex">
            <div className="w-full flex flex-col">
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon color="#94a3b8" width={16} height={16} />
                </div>
                <input
                  type="text"
                  className="w-full h-10 pl-10 p-3 block bg-white border-b border-slate-200 rounded-t font-normal text-shark-950 text-sm placeholder:text-slate-400 focus:outline-none"
                  placeholder="Pesquisar um paciente"
                  value={value}
                  onChange={onChange}
                />
                {value !== "" && (
                  <button
                    type="button"
                    onClick={() => setValue("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <Cross2Icon
                      width={16}
                      height={16}
                      className="text-slate-500 hover:text-slate-600"
                    />
                  </button>
                )}
              </div>
              <VerticalScrollbarContainer styleViewportArea="w-full bg-white max-h-[488px] overflow-y-scroll">
                {(value !== "" || isLoading) &&
                  (isLoading ? (
                    <div className="w-full h-12 px-4 py-4 flex justify-center items-center">
                      <DotsLoad />
                    </div>
                  ) : (
                    <ul
                      role="list"
                      className="w-full divide-y divide-slate-200"
                    >
                      {data && data.length > 0 ? (
                        data.map((data) => (
                          <li
                            key={data.id}
                            className="w-full flex items-center px-4 py-4"
                          >
                            <SearchPatientResultItem
                              id={data.id}
                              name={data.name}
                              src={data.profile_photo}
                              specie={data.specie}
                              race={data.race}
                            />
                          </li>
                        ))
                      ) : (
                        <li className="w-full font-normal text-slate-700 text-base px-4 py-4">
                          Nenhum resultado encontrado
                        </li>
                      )}
                    </ul>
                  ))}
              </VerticalScrollbarContainer>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchInput; 
