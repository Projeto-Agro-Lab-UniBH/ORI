import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../providers/QueryClient";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { pdfjs } from "react-pdf";
import NextNProgress from 'nextjs-progressbar';
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <NextNProgress
          color="#3b82f6"
          options={{ showSpinner: false }}
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <ToastContainer
          position="bottom-right"
          limit={5}
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="colored"
        />
        <Component {...pageProps} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default MyApp;
