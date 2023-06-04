import { useState } from "react";
import { useQuery } from "react-query";
import Header from "../components/Header/Header";
import { Option } from "../interfaces/Option";
import { api } from "../providers/Api";
import { useAuthContext } from "../contexts/AuthContext";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import Feed from "../components/Feed/Feed";

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
      <Feed />
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
