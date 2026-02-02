import { GroupServer } from "@/types/group";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { useQuery } from "@tanstack/react-query";

// 단일 그룹 조회
export async function getGroup(id: number): Promise<GroupServer> {
  const response = await fetch(`${BASE_URL}/groups/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }

  return response.json();
}

// react-query를 활용한 단일 그룹 조회 훅
export function useGroup(id: number) {
  return useQuery<GroupServer>({
    queryKey: ["group", id],
    queryFn: () => getGroup(id),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
