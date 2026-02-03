import { User } from "@/types/user";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { useQuery } from "@tanstack/react-query";

// 현재 로그인한 사용자 조회
export async function getUser(): Promise<User> {
  const response = await fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

// react-query를 활용한 사용자 조회 훅
export function useUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
