import { TaskServer } from "@/types/taskList";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { useQuery } from "@tanstack/react-query";

// Tasks 목록 조회(그룹 전체 항목)
export async function getAllTasks(
  groupId: number,
  date?: string,
): Promise<TaskServer[]> {
  const url = new URL(`${BASE_URL}/groups/${groupId}/tasks`);
  if (date) {
    url.searchParams.append("date", date);
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Alltasks");
  }

  return response.json();
}

// react-query를 활용한 Tasks 목록 조회 훅(그룹 전체 항목)
export function useAllTasks(groupId: number, date?: string) {
  return useQuery<TaskServer[]>({
    queryKey: ["allTasks", groupId, date],
    queryFn: () => getAllTasks(groupId, date),
    staleTime: 1000 * 60 * 5,
  });
}

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

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

// Task 단일 조회
export async function getTask(
  groupId: number,
  taskListId: number,
  taskId: number,
): Promise<TaskServer> {
  const response = await fetch(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  return response.json();
}
