import Link from "next/link";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import Head from "next/head";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
  seoTitle?: string;
}
export interface SearchForm {
  search?: string;
}
interface SearchResponse {
  ok: boolean;
  searchs:any[];
}
export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
  seoTitle,
}: LayoutProps) {
  const { register, handleSubmit, reset } = useForm<SearchForm>();

  const router = useRouter();
  const onClick = () => {
    router.back();
  };
  const [searchword, { loading, data }] = useMutation<SearchResponse>("/api/search");
  const onValid = (search: SearchForm) => {
    // if (loading) return;
    // console.log("search !!! : ",search);
    searchword({id:search.search});
    // console.log("search : ",search.search);
    // if (data && data.ok) {
    //   router.push({
    //     pathname : `/search`,
    //     query: {data: data?.search}
    //   });
    // }
  };

  const searchFuc = (e:any) => {
    if(e.key === 'Enter') {
      // console.log(e.target.value);
      onValid({search:e.target.value});
      // router.push(`/search/${e.target.value}`);
    }
  }
  useEffect(() => {
    if (data && data.ok) {
      console.log("data1 : ",data);
      if (data && data.ok) {
        router.push({
          pathname : "/search",
          query: {data:JSON.stringify(data?.searchs)}
        });
      }
    }
  }, [data]);
  return (
    <div>
      <Head>
        <title>{seoTitle} | Carrot Market</title>
      </Head>
      <div className="hidden md:flex h-[4rem] max-w-[75rem] mx-auto my-0 justify-between items-center py-3 px-4">
        <div className="flex">
          <Link href="/">
            <span className="mr-10 cursor-pointer"><svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.6241 5.1897C4.76013 5.1897 0 9.94831 0 15.8104C0 18.2759 0.845096 20.5345 2.24209 22.3276C2.34557 22.4655 2.4663 22.6035 2.56978 22.7414C2.74225 22.9311 2.89747 23.1207 3.08719 23.3104L3.10443 23.3276C5.13956 25.4828 7.70934 27.1207 10.6068 28C13.5043 27.1207 16.0741 25.4828 18.1092 23.3276L18.1264 23.3104C18.2989 23.1207 18.4714 22.9311 18.6439 22.7414C18.7646 22.6035 18.8681 22.4655 18.9715 22.3276C20.3685 20.5345 21.2136 18.2759 21.2136 15.8104C21.2309 9.93107 16.488 5.1897 10.6241 5.1897ZM10.6241 19.8621C8.38197 19.8621 6.57105 18.0518 6.57105 15.8104C6.57105 13.569 8.38197 11.7587 10.6241 11.7587C12.8662 11.7587 14.6771 13.569 14.6771 15.8104C14.6771 18.0518 12.8662 19.8621 10.6241 19.8621Z" fill="#FF7E36"></path><path d="M14.0743 4.96552C14.7814 4.81035 15.2988 4.18965 15.2988 3.44827C15.2988 2.58621 14.5917 1.87931 13.7293 1.87931C13.4879 1.87931 13.2637 1.93104 13.0567 2.03449C12.8325 0.879318 11.8322 0 10.6076 0C9.38312 0 8.3828 0.879318 8.1586 2.03449C7.95163 1.93104 7.72742 1.87931 7.48597 1.87931C6.62363 1.87931 5.9165 2.58621 5.9165 3.44827C5.9165 4.18965 6.45116 4.81035 7.14103 4.96552C8.22758 4.58621 9.38312 4.37931 10.5904 4.37931C11.7977 4.37931 12.9877 4.58621 14.0743 4.96552Z" fill="#00B493"></path><path d="M28.8191 15.9481H35.3211C36.1317 15.9481 36.7699 15.4654 36.7699 14.4654C36.7699 13.4654 36.1317 12.9826 35.3211 12.9826H29.6642C29.371 12.9826 29.1985 12.8102 29.1985 12.5344V9.98264C29.1985 9.70678 29.371 9.53437 29.6642 9.53437H35.3211C36.1317 9.53437 36.7699 9.0516 36.7699 8.0516C36.7699 7.0516 36.1317 6.56885 35.3211 6.56885H28.8191C26.6115 6.56885 25.5767 7.5516 25.5767 9.39643V13.1378C25.5767 14.9826 26.6115 15.9481 28.8191 15.9481Z" fill="#FF7E36"></path><path d="M36.9594 17.1379H30.5608C27.6806 17.1379 25.7834 18.7241 25.7834 21.0517C25.7834 23.3276 27.6806 24.9138 30.5608 24.9138H36.9594C39.8396 24.9138 41.754 23.3276 41.754 21.0517C41.754 18.7414 39.8396 17.1379 36.9594 17.1379ZM36.9594 21.9138H30.5608C29.8537 21.9138 29.4743 21.5345 29.4743 21.0517C29.4743 20.5345 29.8537 20.1379 30.5608 20.1379H36.9594C37.6665 20.1379 38.0632 20.5345 38.0632 21.0517C38.0632 21.5345 37.6493 21.9138 36.9594 21.9138Z" fill="#FF7E36"></path><path d="M42.3754 9.60339H41.3578V7.65512C41.3578 6.81029 40.6162 6.17236 39.5469 6.17236C38.4776 6.17236 37.7188 6.81029 37.7188 7.65512V15.2068C37.7188 16.0517 38.4776 16.6896 39.5469 16.6896C40.6162 16.6896 41.3578 16.0517 41.3578 15.2068V13.1551H42.3754C43.2032 13.1551 43.8586 12.431 43.8586 11.3965C43.8586 10.3965 43.2032 9.60339 42.3754 9.60339Z" fill="#FF7E36"></path><path d="M60.5189 17.6206H45.6693C44.807 17.6206 44.0999 17.0516 44.0999 15.9999C44.0999 15.0171 44.807 14.4137 45.6693 14.4137H60.5189C61.3812 14.4137 62.0883 15.0344 62.0883 15.9999C62.0883 17.0344 61.3812 17.6206 60.5189 17.6206ZM57.4662 12.3964V10.4654C57.4662 10.1206 57.2764 9.93092 56.9833 9.93092H46.6869C45.79 9.93092 45.0312 9.36194 45.0312 8.27574C45.0312 7.24125 45.79 6.56885 46.6869 6.56885H57.7766C59.9842 6.56885 61.1052 7.70678 61.1052 9.72402V12.3964C61.1052 13.2413 60.3636 13.8792 59.2943 13.8792C58.225 13.8792 57.4662 13.2413 57.4662 12.3964ZM48.7565 19.7068V20.9826C48.7565 21.2413 48.9462 21.4137 49.2394 21.4137H59.829C60.7258 21.4137 61.4847 21.9999 61.4847 23.0688C61.4847 24.1033 60.7258 24.724 59.829 24.724H48.4633C46.273 24.724 45.1002 23.793 45.1002 21.8102V19.7068C45.1002 18.8619 45.8418 18.224 46.9111 18.224C47.9804 18.224 48.7565 18.8619 48.7565 19.7068Z" fill="#FF7E36"></path><path d="M63.9343 21.362V9.12063C63.9343 7.44822 64.7794 6.56891 66.5214 6.56891H71.2642C73.0062 6.56891 73.8513 7.43098 73.8513 9.12063V21.362C73.8513 23.0344 73.0062 23.9137 71.2642 23.9137H66.5214C64.7967 23.9137 63.9343 23.0517 63.9343 21.362ZM70.4364 20.2068V10.293C70.4364 10.0517 70.3157 9.91373 70.0914 9.91373H67.7114C67.5044 9.91373 67.3664 10.0689 67.3664 10.293V20.2068C67.3664 20.4482 67.4872 20.5861 67.7114 20.5861H70.0914C70.3157 20.5861 70.4364 20.431 70.4364 20.2068ZM76.0934 23.3448V7.75856C76.0934 6.86201 76.8522 6.17236 77.9215 6.17236C78.9908 6.17236 79.7324 6.87925 79.7324 7.75856V12.862H80.75C81.5779 12.862 82.2332 13.6551 82.2332 14.6379C82.2332 15.7068 81.5779 16.4482 80.75 16.4482H79.7324V23.3448C79.7324 24.2413 78.9908 24.931 77.9215 24.931C76.8522 24.931 76.0934 24.2413 76.0934 23.3448Z" fill="#FF7E36"></path><path d="M91.5291 10.4136H92.2707V7.60331C92.2707 6.79296 92.9261 6.24124 93.9264 6.24124C94.9267 6.24124 95.5476 6.79296 95.5476 7.60331V15.9826C95.5476 16.793 94.9267 17.3447 93.9264 17.3447C92.9261 17.3447 92.2707 16.793 92.2707 15.9826V13.5171H91.5291C91.1324 13.5171 90.7702 13.3274 90.5288 12.9654C89.5285 15.1723 87.7693 16.9481 85.3202 18.0343C84.5269 18.3792 83.6818 18.155 83.2333 17.4136C82.7849 16.6723 83.0781 15.7067 83.768 15.4136C84.8718 14.9309 85.7859 14.2757 86.493 13.4309H84.7166C84.0439 13.4309 83.4403 13.0343 83.4403 12.1378C83.4403 11.3102 84.0267 10.8447 84.7166 10.8447H87.8383C87.9245 10.5343 88.0107 10.1895 88.0452 9.82744C88.0797 9.55158 87.9417 9.36193 87.683 9.36193H84.8201C84.0095 9.36193 83.4403 8.89641 83.4403 7.96537C83.4403 7.06882 84.0095 6.53434 84.8201 6.53434H88.3039C90.615 6.53434 91.6843 7.63779 91.3394 10.1205C91.3221 10.2068 91.3221 10.3102 91.3049 10.3964C91.3739 10.4137 91.4428 10.4136 91.5291 10.4136ZM98.0311 24.6033C95.8236 24.1378 93.1848 22.9309 91.4773 21.5516C89.8906 23.1205 87.7693 24.2757 85.5272 24.7067C84.7683 24.8619 83.8715 24.4998 83.5955 23.5688C83.3368 22.6723 83.7852 21.8619 84.5958 21.655C87.0449 21.0171 89.08 19.6033 90.0976 17.7067C90.408 17.1378 91.2704 16.7585 92.2362 17.0516C93.2538 17.3619 93.6677 18.3274 93.3572 18.9998L93.34 19.0343C94.7542 20.2067 96.8584 21.1205 98.928 21.5688C99.7213 21.7412 100.187 22.5516 99.9283 23.4654C99.6696 24.3792 98.8073 24.7585 98.0311 24.6033ZM96.3409 16.5688V7.5171C96.3409 6.70676 97.0136 6.15503 98.0484 6.15503C99.066 6.15503 99.7213 6.70676 99.7213 7.5171V16.5688C99.7213 17.3792 99.066 17.9309 98.0484 17.9309C97.0308 17.9309 96.3409 17.3792 96.3409 16.5688Z" fill="#FF7E36"></path></svg></span>
          </Link>
          <ul className="flex items-center space-x-7 text-lg text-gray-600 font-medium">
            <Link href="/community">
              <li className="cursor-pointer">동네생활</li>
            </Link>
            <Link href="/chats">
              <li className="cursor-pointer">채팅</li>
            </Link>
            <Link href="/streams">
              <li className="cursor-pointer">라이브</li>
            </Link>
            <Link href="/profile">
              <li className="cursor-pointer">나의캐럿</li>
            </Link>
          </ul>
        </div>
        <div>
          <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 flex space-x-3">
            <input
              {...register("search")}
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              name="search"
              type="search"
              placeholder="물품을 검색해보세요"
              required
              onKeyUp={(e)=> searchFuc(e)}
            />
            <button className={cls(
              "w-20 m-0 bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none"
            )}>{loading ? "Loading..." : "검색"}</button>
          </form>
        </div>
      </div>
      <div className="md:hidden bg-white h-12 w-full max-w-xl  justify-center text-lg px-10 font-medium fixed text-gray-800 border-b top-0  flex items-center z-10">{/* md:max-w-full */}
        {canGoBack ? (
          <button onClick={onClick} className="absolute left-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        ) : null}
        {title ? (
          <span className={cls(canGoBack ? "mx-auto" : "", "")}>{title}</span>
        ) : null}
      </div>
      <div className={cls("pt-12 md:max-w-5xl md:mx-auto md:my-0", hasTabBar ? "pb-24" : "")}>{children}</div>
      {hasTabBar ? (
        <nav className="md:hidden bg-white w-full  max-w-xl text-gray-700 border-t fixed bottom-0 px-10 pb-5 pt-3 flex justify-between text-xs">{/* md:max-w-full */}
          <Link href="/">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/"
                  ? "text-orange-500"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span>홈</span>
            </a>
          </Link>
          <Link href="/community">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/community"
                  ? "text-orange-500"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
              <span>동네생활</span>
            </a>
          </Link>
          <Link href="/chats">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/chats"
                  ? "text-orange-500"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>채팅</span>
            </a>
          </Link>
          <Link href="/streams">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/streams"
                  ? "text-orange-500"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
              <span>라이브</span>
            </a>
          </Link>
          <Link href="/profile">
            <a
              className={cls(
                "flex flex-col items-center space-y-2 ",
                router.pathname === "/profile"
                  ? "text-orange-500"
                  : "hover:text-gray-500 transition-colors"
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span>나의 캐럿</span>
            </a>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
