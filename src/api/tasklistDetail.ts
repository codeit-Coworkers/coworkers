import { BASE_URL } from "./config";
import { fetchClient } from "@/lib/fetchClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type User = {
  id: number;
  nickname: string;
  image: string | null;
};

type DoneBy = {
  user: User | null;
} | null;

type Recurring = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  frequencyType: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  groupId: number;
  monthDay: number | null;
  startDate: string;
  taskListId: number;
  weekDays: number[];
  writerId: number;
};

type TaskListDetailResponse = {
  id: number;
  name: string;
  description: string;
  date: string;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  displayIndex: number;
  commentCount: number;
  doneAt: null;
  doneBy: DoneBy;
  deletedAt: string | null;
  recurringId: number;
  recurring: Recurring;
  updatedAt: string;
  writer: User;
  createdAt: string;
};

type TaskComment = {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

type TaskCommentsResponse = TaskComment[];

export async function getUser(): Promise<User> {
  const response = await fetchClient<User>(`${BASE_URL}/user`, {
    method: "GET",
  });
  return response;
}

export function useGetUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: getUser,
  });
}

export async function getTaskList(groupId: number, taskListId: number) {
  const response = await fetchClient<TaskListDetailResponse>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}`,
    {
      method: "GET",
    },
  );
  return response;
}

export async function updateTaskListDone(
  groupId: number,
  taskListId: number,
  taskId: number,
  done: boolean,
) {
  const response = await fetchClient<TaskListDetailResponse>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ done }),
    },
  );
  return response;
}

export function useUpdateTaskListDone(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (done: boolean) =>
      updateTaskListDone(groupId, taskListId, taskId, done),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", groupId, taskListId, taskId],
      });
    },
  });
}

export async function getTask(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  const response = await fetchClient<TaskListDetailResponse>(
    `${BASE_URL}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    {
      method: "GET",
    },
  );
  return response;
}

export function useGetTask(
  groupId: number,
  taskListId: number,
  taskId: number,
) {
  return useQuery<TaskListDetailResponse>({
    queryKey: ["task", groupId, taskListId, taskId],
    queryFn: () => getTask(groupId, taskListId, taskId),
  });
}

export async function getTaskComments(
  taskId: number,
): Promise<TaskCommentsResponse> {
  const response = await fetchClient<TaskCommentsResponse>(
    `${BASE_URL}/tasks/${taskId}/comments`,
    {
      method: "GET",
    },
  );
  return response;
}

export function useGetTaskComment(taskId: number) {
  return useQuery({
    queryKey: ["taskComments", taskId],
    queryFn: () => getTaskComments(taskId),
    enabled: !!taskId,
  });
}

export async function createTaskComments(
  taskId: number,
  content: string,
): Promise<TaskCommentsResponse> {
  const response = await fetchClient<TaskCommentsResponse>(
    `${BASE_URL}/tasks/${taskId}/comments`,
    {
      method: "POST",
      // headers: authHeaders,
      body: JSON.stringify({ content }),
    },
  );
  return response;
}

export function useCreateTaskComment(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createTaskComments(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", taskId],
      });
    },
  });
}

export async function updateTaskComments(
  taskId: number,
  commentId: number,
  content: string,
): Promise<TaskCommentsResponse> {
  const response = await fetchClient<TaskCommentsResponse>(
    `${BASE_URL}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ content }),
    },
  );
  return response;
}

export function useUpdateTaskComment(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { commentId: number; content: string }) =>
      updateTaskComments(taskId, params.commentId, params.content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", taskId],
      });
    },
  });
}

export async function deleteTaskComments(
  taskId: number,
  commentId: number,
): Promise<void> {
  const response = await fetchClient<void>(
    `${BASE_URL}/tasks/${taskId}/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );
  return response;
}

export function useDeleteTaskComment(taskId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteTaskComments(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskComments", taskId],
      });
    },
  });
}
