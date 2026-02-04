export type UserMembership = {
  group: {
    teamId: string;
    updatedAt: string;
    createdAt: string;
    image: string;
    name: string;
    id: number;
  };
  role: "ADMIN" | "MEMBER";
  userImage: string;
  userEmail: string;
  userName: string;
  groupId: number;
  userId: number;
};

export type User = {
  teamId: string;
  image: string;
  nickname: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  id: number;
  memberships: UserMembership[];
};
