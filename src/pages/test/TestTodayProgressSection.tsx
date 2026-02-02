import { useEffect, useState } from "react";
import TodayProgressSection from "@/features/TodayProgressSection";
import { getGroups } from "@/api/groups";
import { GroupServer, GroupSummaryServer } from "@/types/group";
import { getGroup } from "@/api/userGroups";
import { Tasks } from "@/types/taskList";
import { getTasks } from "@/api/tasks";

export default function TestProgressSection() {
  const [groups, setGroups] = useState<GroupSummaryServer[]>([]);
  const [group, setGroup] = useState<GroupServer>();

  const [tasks, setTasks] = useState<Tasks>([]);

  // 그룹 목록 조회
  useEffect(() => {
    getGroups().then(setGroups);
  }, []);

  // group 조회
  useEffect(() => {
    getGroup(3810).then(setGroup);
  }, []);

  // task 조회
  useEffect(() => {
    const data = getTasks(3810, 5284, "2026-02-02").then(setTasks);
    console.log(data);
  }, []);

  // group에서 taskLists 직접 추출 (별도 state 불필요)
  const taskLists = group?.taskLists ?? [];

  if (groups.length === 0) return <div>로딩 중...</div>;

  return (
    <div>
      {group && (
        <div>
          <h2>Group</h2>
          <p>ID: {group.id}</p>
          <p>Name: {group.name}</p>
        </div>
      )}

      <h2>TaskLists</h2>
      {taskLists.map((taskList) => (
        <div key={taskList.id}>
          <p>ID: {taskList.id}</p>
          <p>Name: {taskList.name}</p>
          <p>Tasks: {taskList.tasks.length}개</p>
          <hr />
        </div>
      ))}

      <h2>todo List</h2>
      <>{console.log(tasks)}</>
      {tasks.map((task) => (
        <div key={task.id}>
          <p>ID: {task.id}</p>
          <p>Name: {task.name}</p>
          <p>Tasks: {task.description}개</p>
          <hr />
        </div>
      ))}

      <h2>TodayProgressSection</h2>
      {groups.map((group) => (
        <TodayProgressSection key={group.id} id={group.id} name={group.name} />
      ))}
    </div>
  );
}
