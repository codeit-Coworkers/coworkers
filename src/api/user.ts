// ========================================
// User API
// Swagger: user
// ========================================

import { User } from "@/types/user";
import { GroupSummaryServer } from "@/types/group";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchClient } from "@/lib/fetchClient";

// 현재 로그인한 사용자 조회
export async function getUser(): Promise<User> {
  return await fetchClient(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });
}

// react-query를 활용한 사용자 조회 훅
export function useUser() {
  return useSuspenseQuery<User>({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 그룹 목록 조회 (사용자가 속한 그룹)
export async function getGroups(): Promise<GroupSummaryServer[]> {
  return await fetchClient(`${BASE_URL}/user/groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });
}

// react-query를 활용한 그룹 목록 조회 훅
export function useGroups() {
  return useSuspenseQuery<GroupSummaryServer[]>({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 1000 * 10, // 10초
  });
}

// 비밀번호 재설정 이메일 전송 API
export async function sendResetPasswordEmail(data: {
  email: string;
  redirectUrl: string;
}): Promise<{ message: string }> {
  return await fetchClient(`${BASE_URL}/user/send-reset-password-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function resetPassword(data: {
  passwordConfirmation: string;
  password: string;
  token: string;
}): Promise<{ message: string }> {
  return await fetchClient(`${BASE_URL}/user/reset-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
