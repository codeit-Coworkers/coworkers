import TodayProgressSection from "@/features/TodayProgressSection/TodayProgressSection";
import { useGroup } from "@/api/userGroups";
import { useAllTasks } from "@/api/tasks";
import { useUser } from "@/api/user";

// 목업 그룹 데이터 (API 실패 시 폴백용)
const mockGroupData = {
  name: "경영관리 팀",
  id: 1,
  members: [
    {
      userId: 1,
      userImage: "https://picsum.photos/seed/user1/100/100",
      userName: "김관리자",
      role: "ADMIN",
    },
    {
      userId: 2,
      userImage: "https://picsum.photos/seed/user2/100/100",
      userName: "이멤버",
      role: "MEMBER",
    },
    {
      userId: 3,
      userImage: "https://picsum.photos/seed/user3/100/100",
      userName: "박개발",
      role: "MEMBER",
    },
    {
      userId: 4,
      userImage: "https://picsum.photos/seed/user4/100/100",
      userName: "최디자인",
      role: "MEMBER",
    },
  ],
};

// 목업 할 일 데이터 (API 실패 시 폴백용)
const mockTasks = [
  { doneAt: "2024-01-01" }, // 완료
  { doneAt: "2024-01-01" }, // 완료
  { doneAt: null }, // 미완료
  { doneAt: null }, // 미완료
  { doneAt: null }, // 미완료
];

export default function TestProgressSection() {
  const { data: apiGroupData, isLoading: groupLoading } = useGroup(3810);
  const { data: apiTasks, isLoading: allTasksLoading } = useAllTasks(3810);
  const { data: user } = useUser();

  if (groupLoading || allTasksLoading) {
    return <div>로딩 중...</div>;
  }

  // API 데이터 있으면 사용, 없으면 목업으로 폴백
  const groupData = apiGroupData ?? mockGroupData;
  const allTasks = apiTasks ?? mockTasks;

  // 현재 그룹에서 관리자인지 확인
  const isAdmin =
    user?.memberships.find((member) => member.groupId === groupData.id)
      ?.role === "ADMIN";

  return (
    <div>
      <TodayProgressSection
        groupData={groupData}
        allTasks={allTasks}
        isAdmin={isAdmin}
      />
    </div>
  );
}
