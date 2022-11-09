import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppContexts } from "../contexts";
// import { AuthProvider } from "../contexts/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContexts>
      <Head>
        <title>OriFox</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </AppContexts>
  );
}

export default MyApp;
