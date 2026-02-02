import { GroupSummaryServer } from "@/types/group";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { useQuery } from "@tanstack/react-query";

// 그룹 목록 조회
export async function getGroups(): Promise<GroupSummaryServer[]> {
  const response = await fetch(`${BASE_URL}/user/groups`, {
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

// react-query를 활용한 그룹 목록 조회 훅
export function useGroups() {
  return useQuery<GroupSummaryServer[]>({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 10, // 10초
  });
}
