import { GroupMemberServer } from "@/types/member";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";

// 멤버 단일 조회
export async function getMember(
  groupId: number,
  memberUserId: number,
): Promise<GroupMemberServer> {
  const response = await fetch(
    `${BASE_URL}/groups/${groupId}/member/${memberUserId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch member");
  }

  return response.json();
}
