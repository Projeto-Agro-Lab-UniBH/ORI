import RegisterPatientModal from "../../components/Modal/RegisterPatientModal";
import PatientCard from "../../components/Cards/PatientCard";
import Pagination from "../../components/Pagination";
import Header from "../../components/Header";
import useUrlQueryParams from "../../hooks/useUrlQueryParams";
import PatientCardSkeleton from "../../components/Skeletons/PatientCardSkeleton";
import SelectFilter from "../../components/Selects/SelectFilter";
import useSearch from "../../hooks/useSearch";
import SearchInput from "../../components/Inputs/SearchInput";
import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { SelectSchema } from "../../@types/SelectSchema";

export default function AppPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logOut } = useAuthContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [selectPrognosis, setSelectPrognosis] = useState<SelectSchema | null>(null);
  const [selectPhysicalShape, setSelectPhysicalShape] = useState<SelectSchema | null>(null);
  const [selectGender, setSelectGender] = useState<SelectSchema | null>(null);
  const [isLoadingFindedData, setIsLoadingFindedData] = useState<boolean>(false);

  const handleSelect = async (field: string, value: any) => {
    const query = { ...router.query, [field]: value, page: "1" };
    setCurrentPage(1);

    await router.push({
      pathname: router.pathname,
      query,
    });

    router.reload();
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
  };

  useEffect(() => {
    const setSearchValue = (field: string) => {
      const value = searchParams.get(field);
      if (value) {
        const option = { value, label: value };
        switch (field) {
          case "prognosis":
            setSelectPrognosis(option);
            break;
          case "physical_shape":
            setSelectPhysicalShape(option);
            break;
          case "gender":
            setSelectGender(option);
            break;
          default:
            break;
        }
      } else {
        switch (field) {
          case "prognosis":
            setSelectPrognosis(null);
            break;
          case "physical_shape":
            setSelectPhysicalShape(null);
            break;
          case "gender":
            setSelectGender(null);
            break;
          default:
            break;
        }
      }
    };

    setSearchValue("prognosis");
    setSearchValue("physical_shape");
    setSearchValue("gender");
  }, [
    searchParams,
    setSelectPrognosis,
    setSelectPhysicalShape,
    setSelectGender,
  ]);

  const { data: dataPatient } = useSearch({ searchInputValue, setIsLoadingFindedData });
  const { data, isLoading } = useUrlQueryParams({ currentPage, router });

  return (
    <div className="w-full flex items-center justify-center my-4">
      <div className="w-[1280px] flex flex-col items-center justify-center gap-6">
        <Header user={user} logOut={logOut} />
        <div className="w-[1280px] h-24 flex flex-col items-center">
          <div className="w-[1280px] flex items-center gap-3 z-10">
            {/* Select components */}
            <SelectFilter
              field="prognosis"
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
              onChange={(option) => handleSelect("prognosis", option?.value)}
            />
            <SelectFilter
              field="physical_shape"
              value={selectPhysicalShape}
              placeholder="Filtrar porte físico"
              options={[
                { value: "Grande porte", label: "Grande porte" },
                { value: "Médio porte", label: "Médio porte" },
                { value: "Pequeno porte", label: "Pequeno porte" },
              ]}
              onChange={(option) =>
                handleSelect("physical_shape", option?.value)
              }
            />
            <SelectFilter
              field="gender"
              value={selectGender}
              placeholder="Filtrar por gênero"
              options={[
                { value: "Macho", label: "Macho" },
                { value: "Fêmea", label: "Fêmea" },
              ]}
              onChange={(option) => handleSelect("gender", option?.value)}
            />
            {/* Search input */}
            <SearchInput
              field="search"
              data={dataPatient}
              isLoading={isLoadingFindedData}
              value={searchInputValue}
              setValue={setSearchInputValue} 
              onChange={handleSearchInput}
            />
            {/* RegisterPatientModal component */}
            <div className="w-10 h-24 flex items-center">
              <RegisterPatientModal />
            </div>
          </div>
        </div>
        <div className="w-[1280px] flex flex-col gap-6">
          {/* Patient cards */}
          <div className="w-[1280px] flex flex-col gap-6">
            {isLoading ? (
              <>
                {/* Skeleton loading */}
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <PatientCardSkeleton key={index} />
                ))}
              </>
            ) : (
              // Render patient cards
              data?.results.map((data) => (
                <PatientCard key={data.id} {...data} />
              ))
            )}
          </div>
          {/* Pagination */}
          {!isLoading && data?.info && data.info.length >= 6 && (
            <div className="w-[1280px] h-14 flex items-center justify-center">
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
