import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { DashboardPatientDataResponse } from "../@types/ApiResponse";
import { api } from "../providers/Api";     
import { Option } from "../interfaces/Option";
import Header from "../components/Header";
import SelectInput from "../components/Shared/SelectInput";
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
  const [selectStatus, setSelectStatus] = useState<Option | null>(null);
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
          case "status":
            setSelectStatus(option);
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
          case "status":
            setSelectStatus(null);
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

    setSearchValue("status");
    setSearchValue("physical_shape");
    setSearchValue("gender");
  }, [
    searchParams,
    setSelectStatus,
    setSelectPhysicalShape,
    setSelectGender,
  ]);
  
  return (
    <div className="w-full flex items-center justify-center my-4">
      <div className="w-[1280px] flex flex-col items-center justify-center gap-6">
        <Header />
        <div className="w-[1280px] h-24 flex flex-col items-center">
          <div className="w-[1280px] flex items-center gap-3 z-10">
            <SelectInput
              width={"w-[216px]"}
              field="status"
              isClearable={true}
              isSearchable={false}
              value={selectStatus}
              placeholder="Filtrar por status"
              options={[
                { label: "Vivo", value: "Vivo" },
                { label: "Favorável", value: "Favorável" },
                { label: "Risco", value: "Risco" },
                { label: "Alto risco", value: "Alto risco" },
              ]}
              onChange={(option) => handleSelect("status", option?.value)}
            />
            <SelectInput
              width={"w-[200px]"}
              field="physical_shape"
              isClearable={true}
              isSearchable={false}
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
            <SelectInput
              width={"w-[200px]"}
              field="gender"
              isClearable={true}
              isSearchable={false}
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
        <div className={`w-[1280px] flex flex-col ${data.info.length <= 16 ? "mb-14" : ""} gap-6`}>
          <div className="w-[1280px] flex flex-col gap-6">
            {data.results.map((data, i) =>  <PatientCard key={i} {...data} /> )}
          </div>
          {data.info.length > 16 && (
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

  const { page = 1, status = "", physical_shape = "", gender = "" } = ctx.query;

  const queryString = new URLSearchParams({
    page: page.toString(),
    size: "16",
    status: status.toString(),
    physical_shape: physical_shape.toString(),
    gender: gender.toString(),
  }).toString();

  try {
    const response = await api.get<DashboardPatientDataResponse>(
      `/patient/search/by/filters?${queryString}`
    );

    return {
      props: {
        data: response.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        data: [],
      },
    };
  }
};