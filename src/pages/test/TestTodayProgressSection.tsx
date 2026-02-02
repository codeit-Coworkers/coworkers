import TodayProgressSection from "@/features/TodayProgressSection";
import { useGroup } from "@/api/userGroups";
import { useAllTasks } from "@/api/tasks";

export default function TestProgressSection() {
  // 그룹 조회
  const {
    data: groupData,
    isLoading: groupLoading,
    error: groupError,
  } = useGroup(3810);

  const {
    data: allTasks = [],
    isLoading: allTasksLoading,
    error: allTasksError,
  } = useAllTasks(3810);

  if (groupLoading) {
    return <div>로딩 중...</div>;
  }

  if (groupError) {
    return <div>에러 발생: {groupError.message}</div>;
  }

  if (allTasksLoading) {
    return <div>로딩 중...</div>;
  }

  if (allTasksError) {
    return <div>에러 발생: {allTasksError.message}</div>;
  }

  if (!groupData) {
    return <div>데이터 없음</div>;
  }

  return (
    <div>
      <TodayProgressSection groupData={groupData} allTasks={allTasks} />
    </div>
  );
}
