import { useState } from "react";
import { useQuery } from "react-query";
import PatientCard from "../components/Cards/PatientCard";
import RegisterPatientModal from "../components/Modal/RegisterPatientModal";
import Header from "../components/Header/Header";
import { Option } from "../interfaces/Option";
import { api } from "../providers/Api";
import { Load } from "../components/Load/Load";
import { useAuthContext } from "../contexts/AuthContext";

type ListAllPatientsResponse = {
  id: string;
  profile_photo?: string;
  name: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
};

export default function Home() {
  const { user } = useAuthContext();
  const [searchInput, setSearchInput] = useState<string>("");

  const { data, isLoading } = useQuery<ListAllPatientsResponse[] | null>({
    queryKey: ["pacient-list"],
    queryFn: async () => {
      const response = await api.get("/patient");
      return response.data;
    },
  });

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center px-14 mt-4 mb-20 gap-6">
      <Header currentUser={user} />
      <div className="w-full h-full flex flex-col gap-8 items-center">
        <div className="w-[1280px] h-24 flex items-center flex-col border-b border-gray-200">
          <div className="w-full h-24 flex items-center gap-3">
            <input
              type="text"
              id="search"
              className="w-[1054px] h-10 p-3 text-sm text-brand-standard-black font-normal border border-gray-200 rounded bg-white hover:border-[#b3b3b3]"
              placeholder=""
              value={searchInput}
              onChange={handleSearchInput}
            />
            <button className="w-[162px] h-10 bg-brand-standard-black rounded text-white font-normal hover:border hover:bg-white hover:text-brand-standard-black">
              Procurar
            </button>
            <RegisterPatientModal />
          </div>
        </div>
        <div className="w-[1280px] h-full flex flex-col gap-6">
          {isLoading ? (
            <Load
              divProps={{
                className:
                  "w-full h-[488px] flex items-center justify-center relative bg-gray-500-50",
              }}
            />
          ) : (
            data?.map((data) => {
              return (
                <PatientCard
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const apiClient = getAPIClient(ctx);

//   const { ["nextauth.token"]: token } = parseCookies(ctx);

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/sign-in",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
