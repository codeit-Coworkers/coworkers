// ========================================
// Task API
// Swagger: task
// ========================================

import { TaskServer } from "@/types/task";
import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Tasks 목록 조회
export async function getTasks(
  groupId: number,
  taskListId: number,
  date?: string,
): Promise<TaskServer[]> {
  const url = new URL(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks`,
  );
  if (date) {
    url.searchParams.append("date", date);
  }

  return await fetchClient(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Task 단일 조회
export async function getTask(
  groupId: number,
  taskListId: number,
  taskId: number,
): Promise<TaskServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

// Task 수정
export async function updateTask(
  groupId: number,
  taskListId: number,
  taskId: number,
  body: { done?: boolean; name?: string; description?: string },
): Promise<TaskServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

// react-query를 활용한 Task 수정 훅
export function useUpdateTask(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskListId,
      taskId,
      ...body
    }: {
      taskListId: number;
      taskId: number;
      done?: boolean;
      name?: string;
      description?: string;
    }) => updateTask(groupId, taskListId, taskId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}
