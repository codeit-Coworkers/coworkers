// 유저 간단 정보 (doneBy, writer에서 사용)
export interface TaskUserServer {
  image: string;
  nickname: string;
  id: number;
}

// Task 상세
export interface TaskServer {
  doneBy: {
    user: TaskUserServer;
  } | null;
  writer: {
    image: string;
    nickname: string;
    id: number;
  };
  displayIndex: number;
  commentCount: number;
  deletedAt: string | null;
  recurringId: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
  updatedAt: string;
  doneAt: string | null;
  date: string;
  description: string;
  name: string;
  id: number;
}

// TaskList 상세 (tasks 포함)
export interface TaskListServer {
  displayIndex: number;
  groupId: number;
  updatedAt: string;
  createdAt: string;
  name: string;
  id: number;
  tasks: TaskServer[];
}

export interface TaskUser {
  image: string;
  nickname: string;
  id: number;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  date: string;

  displayIndex: number;
  commentCount: number;

  writer: TaskUser;
  doneBy: { user: TaskUser } | null;

  updatedAt: string;
  doneAt: string | null;
  deletedAt: string | null;

  recurringId: number | null;
  frequency: string | null;
}

export type Tasks = Task[];
