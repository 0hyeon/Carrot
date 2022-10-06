import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function useUser() {
  const router = useRouter();
  const [user, Setuser] = useState();
  useEffect(() => {
    fetch("/api/users/me/")
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) {
          return router.replace("/enter");
        }
        Setuser(data.profile);
      });
  }, [router]);
  return user;
}
