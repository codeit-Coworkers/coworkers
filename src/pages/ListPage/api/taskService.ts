// src/api/taskService.ts

export type RepeatRole = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface TaskGroup {
  id: number;
  name: string;
  currentCount: number;
  totalCount: number;
}

export interface Task {
  id: number;
  groupId: number;
  title: string;
  description: string;
  date: string;
  time: string | null;
  isCompleted: boolean;
  repeatRole: RepeatRole;
  commentCount: number;
}

export interface CreateTaskRequest {
  groupId: number;
  title: string;
  date: string;
  time?: string | null;
  description?: string;
  repeatRole?: RepeatRole;
}

const BASE_URL = "https://fe-project-cowokers.vercel.app/api";

// 인증 헤더 생성 함수
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const taskService = {
  // 테스트 계정 로그인을 위한 함수
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    return data;
  },

  getTaskGroups: async (): Promise<TaskGroup[]> => {
    const res = await fetch(`${BASE_URL}/task-groups`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch groups");
    return res.json();
  },

  getTasks: async (groupId: number, date: string): Promise<Task[]> => {
    const res = await fetch(
      `${BASE_URL}/groups/${groupId}/tasks?date=${date}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  },

  updateTaskStatus: async (
    taskId: number,
    isCompleted: boolean,
  ): Promise<Task> => {
    const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isCompleted }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
  },
};
