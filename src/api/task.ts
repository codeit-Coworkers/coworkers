// ========================================
// Task API
// Swagger: task
// ========================================

import { TaskServer } from "@/types/task";
import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";

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

// 할 일 생성
export async function createTask(
  taskListId: number | string,
  body: {
    title: string;
    description?: string;
    startDate?: string;
    frequencyType?: "DAILY" | "WEEKLY" | "MONTHLY" | "NONE";
  },
) {
  return await fetchClient(`${BASE_URL}/task-lists/${taskListId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// 할 일 수정 (완료 처리 등)
export async function updateTask(
  taskId: number,
  body: {
    title?: string;
    description?: string;
    isCompleted?: boolean;
  },
) {
  return await fetchClient(`${BASE_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// 할 일 삭제
export async function deleteTask(taskId: number) {
  return await fetchClient(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
}
