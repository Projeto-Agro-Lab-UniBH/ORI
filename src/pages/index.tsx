import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useContext } from "react";

export default function Home() {
  return (
    <div>
      <h1>App</h1>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const apiClient = getAPIClient(ctx);
//   const { ["jwt"]: token } = parseCookies(ctx);
//   if (!token) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
