import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/load.css";
import "tailwindcss/tailwind.css";
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClientProvider } from "react-query"
import { queryClient } from "../providers/QueryClient";
import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
			</QueryClientProvider>
		</AuthProvider>
  );
}

export default MyApp;
