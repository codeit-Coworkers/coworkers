import { useGroup } from "@/api/group";
import TaskCard from "./components/TaskCard";
import TaskColumnModals from "./components/TaskColumnModals";
import { useTaskColumnModals } from "./components/useTaskColumnModals";

export default function TaskColumn() {
  const { data: groupData } = useGroup(3818);

  console.log(groupData);

  const taskLists = groupData?.taskLists ?? [];

  // taskList 단위로 분류
  // 할 일: 모든 task의 doneAt === null
  const todoLists = taskLists.filter((taskList) => {
    return taskList.tasks.every((task) => !task.doneAt);
  });

  // 진행중: doneAt !== null이 하나 이상 있고, 전부 완료는 아님
  const inProgressLists = taskLists.filter((taskList) => {
    const hasDoneTask = taskList.tasks.some((task) => task.doneAt);
    const allDone = taskList.tasks.every((task) => task.doneAt);
    return hasDoneTask && !allDone;
  });

  // 완료: 모든 task의 doneAt !== null
  const doneLists = taskLists.filter((taskList) => {
    return (
      taskList.tasks.length > 0 && taskList.tasks.every((task) => task.doneAt)
    );
  });

  const { modalType, selectedTaskList, openModal, closeModal } =
    useTaskColumnModals();

  return (
    <div>
      <div style={{ width: "842px", margin: "50px auto" }}>
        {/* 목록 명 */}
        <p className="flex gap-1">
          <span className="text-lg-m text-color-primary">할 일 목록</span>
          <span className="text-lg-m text-color-default">
            ({taskLists.length}개)
          </span>
        </p>

        {/* 할 일 칼럼 */}
        <div className="mt-[16px] justify-between lg:mt-[30px] lg:flex lg:gap-[16px]">
          {/* 할 일 */}
          <div className="bg-background-primary rounded-[12px] lg:w-[270px]">
            <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
              <span className="text-color-primary text-md-m">할 일</span>
            </div>

            {todoLists.map((taskList) => (
              <TaskCard
                key={taskList.id}
                taskList={taskList}
                badgeState="start"
                onEdit={() => openModal("ListEdit", taskList)}
                onDelete={() => openModal("ListDelete", taskList)}
              />
            ))}
          </div>

          {/* 진행중 */}
          <div className="bg-background-primary mt-[16px] rounded-[12px] lg:mt-0 lg:w-[270px]">
            <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
              <span className="text-color-primary text-md-m">진행중</span>
            </div>

            {inProgressLists.map((taskList) => (
              <TaskCard
                key={taskList.id}
                taskList={taskList}
                badgeState="ongoing"
                onEdit={() => openModal("ListEdit", taskList)}
                onDelete={() => openModal("ListDelete", taskList)}
              />
            ))}
          </div>

          {/* 완료 */}
          <div className="bg-background-primary mt-[16px] rounded-[12px] lg:mt-0 lg:w-[270px]">
            <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
              <span className="text-color-primary text-md-m">완료</span>
            </div>

            {doneLists.map((taskList) => (
              <TaskCard
                key={taskList.id}
                taskList={taskList}
                badgeState="done"
                onEdit={() => openModal("ListEdit", taskList)}
                onDelete={() => openModal("ListDelete", taskList)}
              />
            ))}
          </div>
        </div>
      </div>
      <TaskColumnModals
        modalType={modalType}
        selectedTaskList={selectedTaskList}
        closeModal={closeModal}
      />
    </div>
  );
}
