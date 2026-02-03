// ========================================
// TaskList API
// Swagger: tasklist
// ========================================

import { TaskListServer } from "@/types/tasklist";
import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { fetchClient } from "@/lib/fetchClient";

// TaskList 단일 조회
export async function getTaskList(
  groupId: number,
  taskListId: number,
): Promise<TaskListServer> {
  return await fetchClient(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
      },
    },
  );
}
