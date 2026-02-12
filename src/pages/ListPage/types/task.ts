export interface Task {
  id: number;
  groupId: number;
  title: string;
  commentCount: number;
  date: Date;
  time?: string | null;
  repeatLabel?: string;
  isRecurring: boolean;
  isCompleted: boolean;
  memo?: string;
}

export interface TaskGroup {
  id: number;
  name: string;
  current: number;
  total: number;
}

export interface TaskCreateInput {
  title: string;
  date: Date | null;
  time: string | null;
  repeat: string;
  selectedDays: string[];
  memo: string;
}
