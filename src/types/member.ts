export interface GroupMemberServer {
  role: "ADMIN" | "MEMBER";
  userImage: string;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
}
