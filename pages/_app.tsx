import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import Script from "next/script";

// function LoginCheck() {
//   const { user } = useUser();
//   return null;
// }
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-xl mx-auto">
        {/* <LoginCheck /> */}
        <Component {...pageProps} />
        {/* <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          onLoad={() => {
            window.fbAsyncInit = function () {
              FB.init({
                appId: "your-app-id",
                autoLogAppEvents: true,
                xfbml: true,
                version: "v13.0",
              });
            };
          }}
        /> */}
      </div>
    </SWRConfig>
  );
}

export default MyApp;
