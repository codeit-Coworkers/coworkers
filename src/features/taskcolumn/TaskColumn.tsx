import Badge from "@/components/common/Badge/Badge";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import Todo from "@/components/common/Todo/todo";
import AddListIcon from "@/assets/plus.svg";
import { useGroup } from "@/api/group";

export default function TaskColumn() {
  const { data: groupData } = useGroup(3810);

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
              <button
                type="button"
                className="flex h-[24px] w-[24px] items-center justify-center rounded-[8px] border-1 border-[#CBD5E1]"
              >
                <AddListIcon className="text-color-disabled h-[16px] w-[16px]" />
              </button>
            </div>

            {todoLists.map((taskList) => (
              <div key={taskList.id} className="pt-[12px] lg:pt-[20px]">
                <div className="border-border-primary rounded-[12px] border-1 pt-[16px] pr-[16px] pb-[24px] pl-[20px]">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-color-primary text-md-sb truncate">
                      {taskList.name}
                    </p>
                    <div className="flex items-center">
                      <Badge
                        state="start"
                        size="small"
                        current={taskList.tasks.filter((t) => t.doneAt).length}
                        total={taskList.tasks.length}
                      />
                      <button type="button">
                        <Dropdown
                          optionsKey="taskList"
                          listAlign="center"
                          trigger="kebab"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-[16px]">
                    {taskList.tasks.map((task) => (
                      <Todo
                        key={task.id}
                        content={task.name}
                        isCompleted={!!task.doneAt}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 진행중 */}
          <div className="bg-background-primary mt-[16px] rounded-[12px] lg:mt-0 lg:w-[270px]">
            <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
              <span className="text-color-primary text-md-m">진행중</span>
              <button
                type="button"
                className="flex h-[24px] w-[24px] items-center justify-center rounded-[8px] border-1 border-[#CBD5E1]"
              >
                <AddListIcon className="text-color-disabled h-[16px] w-[16px]" />
              </button>
            </div>

            {inProgressLists.map((taskList) => (
              <div key={taskList.id} className="pt-[12px] lg:pt-[20px]">
                <div className="border-border-primary rounded-[12px] border-1 pt-[16px] pr-[16px] pb-[24px] pl-[20px]">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-color-primary text-md-sb truncate">
                      {taskList.name}
                    </p>
                    <div className="flex items-center">
                      <Badge
                        state="ongoing"
                        size="small"
                        current={taskList.tasks.filter((t) => t.doneAt).length}
                        total={taskList.tasks.length}
                      />
                      <button type="button">
                        <Dropdown
                          optionsKey="taskList"
                          listAlign="center"
                          trigger="kebab"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-[16px]">
                    {taskList.tasks.map((task) => (
                      <Todo
                        key={task.id}
                        content={task.name}
                        isCompleted={!!task.doneAt}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 완료 */}
          <div className="bg-background-primary mt-[16px] rounded-[12px] lg:mt-0 lg:w-[270px]">
            <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
              <span className="text-color-primary text-md-m">완료</span>
              <button
                type="button"
                className="flex h-[24px] w-[24px] items-center justify-center rounded-[8px] border-1 border-[#CBD5E1]"
              >
                <AddListIcon className="text-color-disabled h-[16px] w-[16px]" />
              </button>
            </div>

            {doneLists.map((taskList) => (
              <div key={taskList.id} className="pt-[12px] lg:pt-[20px]">
                <div className="border-border-primary rounded-[12px] border-1 pt-[14px] pr-[12px] pb-[14px] pl-[20px]">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-color-primary text-md-sb truncate">
                      {taskList.name}
                    </p>
                    <div className="flex items-center">
                      <Badge
                        state="done"
                        size="small"
                        current={taskList.tasks.filter((t) => t.doneAt).length}
                        total={taskList.tasks.length}
                      />
                      <button type="button">
                        <Dropdown
                          optionsKey="taskList"
                          listAlign="center"
                          trigger="kebab"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
