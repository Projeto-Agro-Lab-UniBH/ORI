import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../providers/QueryClient";
import { AuthProvider } from "../contexts/AuthContext";
import { pdfjs } from "react-pdf";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default MyApp;
