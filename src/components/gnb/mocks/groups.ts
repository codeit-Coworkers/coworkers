import type { Group, GroupResponse } from "@/types/group";

export const MOCK_GROUP_RESPONSES: GroupResponse[] = [
  {
    teamId: "team-1",
    updatedAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    image: "",
    name: "경영관리팀",
    id: 1,
  },
  {
    teamId: "team-2",
    updatedAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    image: "",
    name: "프로덕트팀",
    id: 2,
  },
  {
    teamId: "team-3",
    updatedAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    image: "",
    name: "마케팅팀",
    id: 3,
  },
  {
    teamId: "team-4",
    updatedAt: "2024-01-01T00:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    image: "",
    name: "콘텐츠팀",
    id: 4,
  },
];

// Server → UI 타입 변환 (API 연동 시 React Query select로 대체)
const toGroup = (response: GroupResponse): Group => ({
  id: response.id,
  name: response.name,
  image: response.image,
});

export const MOCK_GROUPS: Group[] = MOCK_GROUP_RESPONSES.map(toGroup);
