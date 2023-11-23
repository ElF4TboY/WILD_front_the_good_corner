import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

import "@/styles/globals.css";
import { Layout } from "@/component/Layout";

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });