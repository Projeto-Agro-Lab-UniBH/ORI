import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { AppContexts } from "../contexts";

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
