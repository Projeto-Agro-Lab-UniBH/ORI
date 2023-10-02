import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { DashboardPatientDataResponse } from "../@types/ApiResponse";
import { api } from "../providers/Api";     
import { Option } from "../interfaces/Option";
import Header from "../components/Header";
import SelectFilter from "../components/SelectFilter";
import RegisterPatientModal from "../components/Modal/RegisterPatientModal";
import PatientCard from "../components/Cards/PatientCard";
import Pagination from "../components/Pagination";
import SearchInput from "../components/SearchInput";

type DashboardProps = {
  data: DashboardPatientDataResponse;
};

export default function Dashboard({ data }: DashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [selectPrognosis, setSelectPrognosis] = useState<Option | null>(null);
  const [selectPhysicalShape, setSelectPhysicalShape] = useState<Option | null>(null);
  const [selectGender, setSelectGender] = useState<Option | null>(null);

  const handleSelect = async (field: string, value: any) => {
    const query = { ...router.query, [field]: value, page: "1" };
    setCurrentPage(1);

    await router.push({
      pathname: router.pathname,
      query,
    });
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
  
  return (
    <div className="w-full flex items-center justify-center my-4">
      <div className="w-[1280px] flex flex-col items-center justify-center gap-6">
        <Header />
        <div className="w-[1280px] h-24 flex flex-col items-center">
          <div className="w-[1280px] flex items-center gap-3 z-10">
            <SelectFilter
              width={"w-[216px]"}
              field="prognosis"
              value={selectPrognosis}
              placeholder="Filtrar status"
              options={[
                { label: "Vivo", value: "Vivo" },
                { label: "Favorável", value: "Favorável" },
                { label: "Risco", value: "Risco" },
                { label: "Alto risco", value: "Alto risco" },
              ]}
              onChange={(option) => handleSelect("prognosis", option?.value)}
            />
            <SelectFilter
              width={"w-[200px]"}
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
              width={"w-[200px]"}
              field="gender"
              value={selectGender}
              placeholder="Filtrar por gênero"
              options={[
                { value: "Macho", label: "Macho" },
                { value: "Fêmea", label: "Fêmea" },
              ]}
              onChange={(option) => handleSelect("gender", option?.value)}
            />
            <SearchInput 
              value={searchInputValue}
              setValue={setSearchInputValue}
              onChange={handleSearchInput}
            />
            <div className="w-10 h-24 flex items-center">
              <RegisterPatientModal />
            </div>
          </div>
        </div>
        <div className={`w-[1280px] flex flex-col ${data.info.length >= 6 ? "" : "mb-14"} gap-6`}>
          <div className="w-[1280px] flex flex-col gap-6">
            {data.results.map((data, i) =>  <PatientCard key={i} {...data} /> )}
          </div>
          {data.info.length > 6 && (
            <div className="w-[1280px] h-14 flex items-center justify-center">
              {data.info && (
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
  )
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

  const { query } = ctx;
  const { page, physical_shape, gender } = query;
  
  const response = await api.get<DashboardPatientDataResponse>(
    `/patient/search/by/filters?page=${page || 1}&size=6&physical_shape=${physical_shape || ""}&gender=${gender || ""}`
  );

  const data = response.data

  return {
    props: {
      data
    },
  };
};