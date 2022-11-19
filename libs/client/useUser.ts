import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export interface ProfileResponse {
  ok: boolean;
  profile: User;
}
export default function useUser() {
  const { data, error } = useSWR<ProfileResponse>(
    typeof window === undefined ? null : "/api/users/me"
  );
  const router = useRouter();
  useEffect(() => {
    if (data && data.ok != true) {
      router.replace("/enter");
    }
  }, [data]);
  return { user: data?.profile, isLoading: !data && !error };
}
