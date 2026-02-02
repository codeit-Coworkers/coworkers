import type { GroupMemberServer } from "./member";
import type { TaskListServer } from "./taskList";

// 그룹 목록 아이템
export interface GroupSummaryServer {
  teamId: string;
  updatedAt: string;
  createdAt: string;
  image: string;
  name: string;
  id: number;
}

// 그룹 상세
export interface GroupServer extends GroupSummaryServer {
  members: GroupMemberServer[];
  taskLists: TaskListServer[];
}
