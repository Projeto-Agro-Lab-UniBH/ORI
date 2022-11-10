import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AppContexts } from "../contexts";
// import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContexts>
      <Head>
        <title>OriFox</title>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </AppContexts>
  );
}

export default MyApp;
