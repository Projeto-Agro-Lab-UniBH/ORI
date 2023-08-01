import Select from "react-select";
import { useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { useEffect, useId } from "react";
import { GetServerSideProps } from "next";
import { ExitIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import UserProfileSkeleton from "../../components/Skeletons/UserProfileSkeleton";
import RegisterPatientModal from "../../components/Modal/RegisterPatientModal";
import DataPatientCard from "../../components/Cards/DataPatientCard";
import Pagination from "../../components/Pagination/Pagination";
import { Loading } from "../../components/Load/Loading";
import UserProfile from "../../components/UserProfile";
import { useSearchParams } from "next/navigation";
import useSearch from "../../hooks/useSearch";

type TSelect = {
  label: string;
  value: string;
};

export default function AppPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logOut } = useAuthContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectPrognosis, setSelectPrognosis] = useState<TSelect | undefined>(undefined);
  const [selectPhysicalShape, setSelectPhysicalShape] = useState<TSelect | undefined>(undefined);
  const [selectGender, setSelectGender] = useState<TSelect | undefined>(undefined);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSelectPrognosis = async (value: any) => {
    router.query.prognosis = value
    router.query.page = '1'
    setCurrentPage(Number(router.query.page))  

    await router.push({
      pathname: router.pathname,
      query: router.query,
    });

    router.reload()
  };

  const handleSelectGender = async (value: any) => {
    router.query.gender = value
    router.query.page = '1'
    setCurrentPage(Number(router.query.page))

    await router.push({
      pathname: router.pathname,
      query: router.query,
    });

    router.reload()
  };

  const handleSelectPhysicalShape = async (value: any) => {
    router.query.physical_shape = value
    router.query.page = '1'
    setCurrentPage(Number(router.query.page))

    await router.push({
      pathname: router.pathname,
      query: router.query
    });

    router.reload()
  };

  const { data, isLoading } = useSearch({ currentPage: currentPage, router: router});

  useEffect(() => {
    if (searchParams.get('prognosis') != '' && searchParams.has('prognosis') == true) {
      setSelectPrognosis({
        value: String(searchParams.get('prognosis')),
        label: String(searchParams.get('prognosis')), 
      });
    } else { setSelectPrognosis(undefined) }

    if (searchParams.get('physical_shape') != '' && searchParams.has('physical_shape') == true) {
      setSelectPhysicalShape({
        value: String(searchParams.get('physical_shape')),
        label: String(searchParams.get('physical_shape')),
      });
    } else { setSelectPhysicalShape(undefined) }
  
    if (searchParams.get('gender') != '' && searchParams.has('gender') == true) {
      setSelectGender({
        value: String(searchParams.get('gender')),
        label: String(searchParams.get('gender')),
      });
    } else { setSelectGender(undefined) }

  }, [searchParams, setSelectPhysicalShape]);

  return (
    <div className="w-full h-full flex flex-col justify-center px-14 mt-4 mb-10 gap-6">
      <div className="w-full h-20 flex justify-center">
        <div className="w-[1280px] flex justify-between">
          {!user ? (
            <UserProfileSkeleton />
          ) : (
            <UserProfile
              id={user?.id}
              profile_photo={user?.profile_photo}
              username={user?.username}
              email={user?.email}
            />
          )}
          <div className="w-14 flex justify-end items-center">
            <button
              onClick={() => logOut()}
              className="w-8 h-8 rounded flex justify-center items-center hover:bg-slate-50"
            >
              <ExitIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col gap-6 items-center">
        <div className="w-[1280px] h-24 flex items-center flex-col ">
          <div className="w-full h-24 flex items-center gap-3 z-10">
            <div className="w-[200px] h-24 flex items-center">
              <Select
                instanceId={useId()}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: 200,
                    height: 40,
                    borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,

                  colors: {
                    ...theme.colors,
                    primary75: "#cbd5e1",
                    primary50: "#e2e8f0",
                    primary25: "#f8fafc",
                    primary: "#212529",
                  },
                })}
                isClearable
                isSearchable={false}
                value={selectPrognosis}
                placeholder="Filtrar prognóstico"
                options={[
                  { value: "Alta", label: "Alta" },
                  { value: "Aguardando alta médica", label: "Aguardando alta médica" },
                  { value: "Obscuro", label: "Obscuro" },
                  { value: "Desfávoravel", label: "Desfávoravel" },
                  { value: "Reservado", label: "Reservado" },
                  { value: "Favorável", label: "Favorável" },
                  { value: "Risco", label: "Risco" },
                  { value: "Alto risco", label: "Alto risco" },
                ]}
                onChange={(option) => handleSelectPrognosis(option?.value)}
              />
            </div>
            <div className="w-[200px] h-24 flex items-center">
              <Select
                instanceId={useId()}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: 200,
                    height: 40,
                    zIndex: 10,
                    borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary75: "#cbd5e1",
                    primary50: "#e2e8f0",
                    primary25: "#f8fafc",
                    primary: "#212529",
                  },
                })}
                isClearable
                isSearchable={false}
                value={selectPhysicalShape}
                placeholder="Filtrar porte físico"
                options={[
                  { value: "Grande porte", label: "Grande porte" },
                  { value: "Médio porte", label: "Médio porte" },
                  { value: "Pequeno porte", label: "Pequeno porte" },
                ]}
                onChange={(option) => handleSelectPhysicalShape(option?.value)}
              />
            </div>
            <div className="w-[178px] h-24 flex items-center">
              <Select
                instanceId={useId()}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    width: 178,
                    height: 40,
                    borderColor: state.isFocused ? "#e2e8f0" : "#e2e8f0",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary75: "#cbd5e1",
                    primary50: "#e2e8f0",
                    primary25: "#f8fafc",
                    primary: "#212529",
                  },
                })}
                isClearable
                isSearchable={false}
                value={selectGender}
                placeholder="Filtrar por gênero"
                options={[
                  { value: "Macho", label: "Macho" },
                  { value: "Fêmea", label: "Fêmea" },
                ]}
                onChange={(option) => handleSelectGender(option?.value)}
              />
            </div>
            <div className="w-full h-24 flex items-center">
              <input
                type="text"
                id="search"
                className="w-full h-10 p-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:border-[#b3b3b3]"
                placeholder=""
                value={searchInput}
                onChange={handleSearchInput}
              />
            </div>
            <div className="w-24">
              <button className="w-24 h-10 bg-brand-standard-black rounded text-white font-normal hover:border hover:bg-white hover:border-[#b3b3b3] hover:text-brand-standard-black">
                Buscar
              </button>
            </div>
            <div className="w-10 h-24 flex items-center">
              <RegisterPatientModal />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-center">
        <div className={"w-[1280px] h-full flex flex-col gap-6"}>
          <div className={"w-[1280px] h-full flex flex-col gap-6"}>
            {isLoading ? (
              <>
                <Loading />
              </>
            ) : (
              data?.results.map((data) => (
                <DataPatientCard
                  key={data.id}
                  id={data.id}
                  name={data.name}
                  race={data.race}
                  specie={data.specie}
                  profile_photo={data.profile_photo}
                  prognosis={data.prognosis}
                  physical_shape={data.physical_shape}
                  gender={data.gender}
                  weight={data.weight}
                  diagnosis={data.diagnosis}
                  exams={["Hemograma"]}
                />
              ))
            )}
          </div>
          {isLoading ? null : Number(data?.info.length) < 6 ? null : (
            <div className="w-full h-8">
              {data?.info && (
                <Pagination
                  limit={data.info.size}
                  total={data.info.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["nextauth.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
