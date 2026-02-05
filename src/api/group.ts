// ========================================
// Group API
// Swagger: group
// ========================================

import { GroupServer, GroupMemberServer } from "@/types/group";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

// 단일 그룹 조회
export async function getGroup(id: number): Promise<GroupServer> {
  return await fetchClient(`${BASE_URL}/groups/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });
}

// react-query를 활용한 단일 그룹 조회 훅
export function useGroup(id: number) {
  return useSuspenseQuery<GroupServer>({
    queryKey: ["group", id],
    queryFn: () => getGroup(id),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 멤버 단일 조회
export async function getMember(
  groupId: number,
  memberUserId: number,
): Promise<GroupMemberServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/member/${memberUserId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
      },
    },
  );
}

// 멤버 삭제
export async function deleteMember(groupId: number, memberUserId: number) {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/member/${memberUserId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
      },
    },
  );
}

// 멤버 삭제 훅
export function useDeleteMember(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberUserId: number) => deleteMember(groupId, memberUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}
