import { TaskListServer, TaskServer } from "@/types/taskList";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";

// TaskList 단일 조회
export async function getTaskList(
  groupId: number,
  taskListId: number,
): Promise<TaskListServer> {
  const response = await fetch(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task list");
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
