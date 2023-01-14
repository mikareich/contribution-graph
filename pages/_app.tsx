import "../styles/globals.css";

import type { AppProps } from "next/app";
import ThemeProvider from "../components/ThemeProvider";
import { GITHUB_LIGHT } from "../utils/themes";
import { IBM_Plex_Sans } from "@next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--ibm-plex-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={GITHUB_LIGHT} font={ibmPlexSans}>
      <div className="App">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
