import Header from "../components/Header/Header";
import Feed from "../components/Feed/Feed";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useAuthContext } from "../contexts/AuthContext";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div className="w-full h-full flex flex-col justify-center px-14 mt-4 mb-10 gap-6">
      <Header user={user} />
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