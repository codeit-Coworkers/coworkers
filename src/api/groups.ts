import { GroupSummaryServer } from "@/types/group";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";

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
