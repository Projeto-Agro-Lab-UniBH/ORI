import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../providers/QueryClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default MyApp;
