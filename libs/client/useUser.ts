import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export default function useUser() {
  const { data, error } = useSWR("/api/users/me/", fetcher); //swr로 밑에 모든코드를 대체
  const router = useRouter();
  // const [user, Setuser] = useState();
  // useEffect(() => {
  //   fetch("/api/users/me/")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (!data.ok) {
  //         return router.replace("/enter");
  //       }
  //       Setuser(data.profile);
  //     });
  // }, [router]);
  return data;
}
