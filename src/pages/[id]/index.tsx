import { useState, useEffect } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { SelectSchema } from "../../@types/SelectSchema";
import RegisterPatientModal from "../../components/Modal/RegisterPatientModal/RegisterPatientModal";
import PatientCard from "../../components/Cards/PatientCard";
import Pagination from "../../components/Pagination/Pagination";
import Header from "../../components/Header/Header";
import useSearch from "../../hooks/useSearch";
import PatientCardSkeleton from "../../components/Skeletons/PatientCardSkeleton";
import SelectFilter from "../../components/SelectFilter";

export default function AppPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logOut } = useAuthContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectPrognosis, setSelectPrognosis] = useState<SelectSchema | null>(null);
  const [selectPhysicalShape, setSelectPhysicalShape] = useState<SelectSchema | null>(null);
  const [selectGender, setSelectGender] = useState<SelectSchema | null>(null);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSelect = async (field: string, value: any) => {
    const query = { ...router.query, [field]: value, page: "1" };
    setCurrentPage(1);

    await router.push({
      pathname: router.pathname,
      query,
    });

    router.reload();
  };

  useEffect(() => {
    const setSelectedValue = (field: string) => {
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

    setSelectedValue("prognosis");
    setSelectedValue("physical_shape");
    setSelectedValue("gender");
  }, [
    searchParams,
    setSelectPrognosis,
    setSelectPhysicalShape,
    setSelectGender,
  ]);

  const { data, isLoading } = useSearch({ currentPage, router });

  return (
    <div className="w-full flex items-center justify-center my-4">
      <div className="w-[1280px] flex flex-col items-center justify-center gap-6">
        <Header user={user} logOut={logOut} />
        <div className="w-[1280px] h-24 flex items-center flex-col">
          <div className="w-[1280px] h-24 flex items-center gap-3 z-10">
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
            {/* Search button */}
            <div className="w-24 h-24 flex items-center">
              <button className="w-24 h-10 bg-brand-standard-black rounded font-medium text-white hover:border hover:bg-white hover:border-[#b3b3b3] hover:text-brand-standard-black">
                Buscar
              </button>
            </div>
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
            <div className="w-[1280px] h-12 flex items-center justify-center">
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
