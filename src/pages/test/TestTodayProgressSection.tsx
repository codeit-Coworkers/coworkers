import TodayProgressSection from "@/features/TodayProgressSection";
import { useGroups } from "@/api/groups";
import { useGroup } from "@/api/userGroups";
import { useAllTasks } from "@/api/tasks";

export default function TestProgressSection() {
  // 그룹 목록 조회
  const { data: groups = [], isLoading, error } = useGroups();

  // 그룹 조회
  const {
    data: groupData,
    isLoading: groupLoading,
    error: groupError,
  } = useGroup(3810);

  // task 조회
  const {
    data: allTasks = [],
    isLoading: taskLoading,
    error: taskError,
  } = useAllTasks(3810, "2026-02-02");

  // group에서 taskLists 직접 추출 (별도 state 불필요)
  const taskLists = groupData?.taskLists ?? [];

  if (isLoading || groupLoading || taskLoading) {
    return <div>로딩 중...</div>;
  }

  if (error || groupError || taskError) {
    return (
      <div>
        에러 발생: {error?.message || groupError?.message || taskError?.message}
      </div>
    );
  }

  // 기본값을 못써서 이렇게 처리해야한다고,,??
  if (!groupData) {
    return <div>데이터 없음</div>;
  }

  return (
    <div>
      {/* 그룹 섹션 */}
      <h2>Group</h2>
      <div>
        <p>ID: {groupData.id}</p>
        <p>Name: {groupData.name}</p>
      </div>
      <br />

      {/* TaskLists 섹션 */}
      <h2>TaskLists</h2>
      <div>
        {taskLists.map((taskList) => (
          <div key={taskList.id}>
            <p>ID: {taskList.id}</p>
            <p>Name: {taskList.name}</p>
            <hr />
          </div>
        ))}
      </div>
      <br />

      {/* todo List 섹션 */}
      <h2>todo List</h2>
      <div>
        {allTasks.map((task) => (
          <div key={task.id}>
            <p>ID: {task.id}</p>
            <p>Name: {task.name}</p>
            <p>Tasks: {task.description}개</p>
            <hr />
          </div>
        ))}
      </div>
      <br />

      {/* TodayProgressSection */}
      <h2>TodayProgressSection</h2>
      {groups.map((group) => (
        <TodayProgressSection key={group.id} id={group.id} name={group.name} />
      ))}
    </div>
  );
}
