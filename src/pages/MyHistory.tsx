import MyTasks from "@/features/MyTasks/MyTasks";
import DatePagination from "./ListPage/components/DatePagination";
import { useMemo, useState } from "react";
import CalendarPicker from "./ListPage/components/CalendarPicker";
import SettingsIcon from "@/assets/settings.svg";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@/components/common/Modal/Modal";
import TeamDeleteModal from "@/components/common/Modal/Contents/TeamDeleteModal";
import { useGroup } from "@/api/group";
import { useCompletedTasks } from "@/api/user";

// description에서 taskListId 파싱 함수
function parseTaskListId(description: string): number | null {
  try {
    const parsed = JSON.parse(description);
    if (parsed.taskListId != null) return Number(parsed.taskListId);
  } catch {
    // JSON 아닌 경우 정규식으로 추출
  }

  // taskListId: 5310 또는 "taskListId": 5310 패턴 매칭
  const match = description.match(/taskListId["\s]*:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

export default function MyHistory() {
  // 데이터 가져오기
  const { id: groupId } = useParams();
  const { data: group } = useGroup(Number(groupId));
  const { data: completedTasks } = useCompletedTasks();

  // 상태 관리
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(
    null,
  );
  const [isDayFilter, setIsDayFilter] = useState(false);

  // 데이터 가공
  // taskList를 id 기준 Map으로 변환
  const taskListMap = useMemo(() => {
    const map = new Map<number, string>();
    group.taskLists.forEach((taskList) => map.set(taskList.id, taskList.name));
    return map;
  }, [group.taskLists]);

  // 1) 완료 task에 taskList 이름 매핑
  const doneTasks = useMemo(() => {
    return completedTasks.tasksDone.map((task) => {
      const taskListId = parseTaskListId(task.description);
      const UNKNOWN = "알 수 없는 목록";

      // taskListId가 null이 아닐 때만 매핑 시도
      const taskListName =
        taskListId !== null
          ? (taskListMap.get(taskListId) ?? UNKNOWN)
          : UNKNOWN;
      return { ...task, taskListId, taskListName };
    });
  }, [completedTasks, taskListMap]);

  // 2) 선택한 월 + 목록 기준으로 필터링
  const filteredTasks = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    return doneTasks
      .filter((task) => {
        const doneDate = new Date(task.doneAt);
        const matchMonth =
          doneDate.getFullYear() === year && doneDate.getMonth() === month;
        if (!matchMonth) return false;
        if (isDayFilter) return doneDate.getDate() === selectedDate.getDate();
        return true;
      })
      .filter((task) => {
        // null === 모든 task 포함, 아니면 선택된 taskListId의 task만 포함
        if (selectedTaskListId === null) {
          return true;
        } else {
          return task.taskListId === selectedTaskListId;
        }
      });
  }, [doneTasks, selectedDate, selectedTaskListId, isDayFilter]);

  // 3) 사이드바용: taskList별 완료 개수
  const taskListCounts = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const counts = new Map<number, number>();

    for (const task of doneTasks) {
      if (task.taskListId === null) continue;
      const doneDate = new Date(task.doneAt);
      if (doneDate.getFullYear() === year && doneDate.getMonth() === month) {
        counts.set(task.taskListId, (counts.get(task.taskListId) ?? 0) + 1);
      }
    }

    return counts;
  }, [doneTasks, selectedDate]);

  // 완료 개수가 1개 이상인 taskList만 필터링
  const activeTaskLists = group.taskLists.filter(
    (taskList) => (taskListCounts.get(taskList.id) ?? 0) > 0,
  );

  // 4) 날짜별 → 날짜 내 taskList별 그룹핑
  const processedData = useMemo(() => {
    // {"2025-6-15":{"tasklist": [{task}, {task}] 구조 생성}}
    const grouped: Record<string, Record<string, typeof filteredTasks>> = {};

    for (const task of filteredTasks) {
      const doneDate = new Date(task.doneAt);
      const dateKey = `${doneDate.getFullYear()}-${doneDate.getMonth() + 1}-${doneDate.getDate()}`;
      const listName = task.taskListName;

      // 날짜 키가 없으면 빈 객체 생성
      if (grouped[dateKey] === undefined) {
        grouped[dateKey] = {};
      }

      // 해당 날짜 안에 목록 이름이 없으면 빈 배열 생성
      if (grouped[dateKey][listName] === undefined) {
        grouped[dateKey][listName] = [];
      }

      // task 추가
      grouped[dateKey][listName].push(task);
    }

    return grouped;
  }, [filteredTasks]);

  // 월 이동 핸들러
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
    setIsDayFilter(false);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
    setIsDayFilter(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDayFilter(true);
  };

  // taskList(목록) 선택 핸들러
  const handleTaskListSelect = (id: number) => {
    setSelectedTaskListId(selectedTaskListId === id ? null : id);
  };

  // 설정 드롭다운 상태
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/team/${groupId}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-background-secondary min-h-screen px-[16px] pt-[17px] pb-[40px] md:px-[26px] md:py-[70px] lg:px-[85px] lg:pt-[90px]">
        {/* 헤더 */}
        <header className="text-color-primary text-lg-b lg:border-border-primary lg:bg-background-primary mb-[25px] lg:mb-[48px] lg:flex lg:w-full lg:max-w-[1120px] lg:items-center lg:rounded-[20px] lg:border lg:px-8 lg:py-5 lg:shadow-sm">
          <div className="flex w-full items-center gap-2 lg:justify-between">
            <h2 className="text-color-primary text-lg-b md:text-2xl-b">
              {group.name}
            </h2>
            <button type="button">
              <Dropdown
                optionsKey="edit"
                listAlign="center"
                trigger="set"
                icon={
                  <SettingsIcon className="h-[16px] w-[16px] md:h-[24px] md:w-[24px]" />
                }
                options={[
                  { label: "수정하기", value: "edit", action: handleEdit },
                  { label: "삭제하기", value: "delete", action: handleDelete },
                ]}
              />
            </button>
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
            >
              <TeamDeleteModal onClose={() => setIsDeleteModalOpen(false)} />
            </Modal>
          </div>
        </header>
        {/* 메인 */}
        <div className="flex gap-[40px]">
          {/* 사이드바 */}
          <div className="hidden w-[322px] lg:block">
            <h3 className="text-xl-b text-color-primary">내가 한 일</h3>
            <div className="mt-[40px] flex flex-col gap-[55px] overflow-y-auto pr-[52px]">
              <div>
                <h4 className="text-lg-m text-color-primary">
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
                </h4>
                {activeTaskLists.length === 0 ? (
                  <p className="text-md-m text-color-default flex h-[120px] items-center justify-center">
                    해당 월에 완료된 할 일이 없습니다.
                  </p>
                ) : (
                  <ul className="mt-[17px] flex flex-col gap-1">
                    {activeTaskLists.map((tasklist) => {
                      const count = taskListCounts.get(tasklist.id) ?? 0;

                      return (
                        <li key={tasklist.id}>
                          <button
                            type="button"
                            onClick={() => handleTaskListSelect(tasklist.id)}
                            className={`flex h-[54px] w-[270px] items-center justify-between rounded-[12px] border-1 px-[20px] ${
                              selectedTaskListId === tasklist.id
                                ? "border-brand-primary bg-background-primary"
                                : "hover:border-brand-primary bg-background-primary border-border-primary"
                            }`}
                          >
                            <span className="text-md-sb text-color-primary">
                              {tasklist.name}
                            </span>
                            <span className="text-md-b text-brand-primary">
                              {count}개
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* 완료한 task */}
          <div className="bg-background-primary w-full rounded-[20px] px-[22px] pt-[33px] pb-[52px] md:px-[30px] md:pt-[46px] lg:w-[758px]">
            <div className="relative flex items-center justify-center md:justify-start">
              <DatePagination
                variant="myhistory"
                selectedDate={selectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              <div className="absolute right-0">
                <CalendarPicker
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                />
              </div>
            </div>

            {/* 모바일 목록 아이템 */}
            <div className="lg:hidden">
              <ul className="mt-[27px] flex flex-wrap gap-1 md:mt-[40px]">
                {activeTaskLists.map((tasklist) => {
                  const count = taskListCounts.get(tasklist.id) ?? 0;
                  const isSelected = selectedTaskListId === tasklist.id;

                  return (
                    <li key={tasklist.id}>
                      <button
                        type="button"
                        onClick={() => handleTaskListSelect(tasklist.id)}
                        className={`group flex h-[33px] shrink-0 items-center gap-1 rounded-[33px] border-1 px-[12px] md:h-[43px] md:rounded-[43px] md:px-[16px] ${
                          isSelected
                            ? "bg-brand-primary border-brand-primary"
                            : "bg-background-primary border-border-primary hover:bg-brand-primary hover:border-brand-primary"
                        }`}
                      >
                        <span
                          className={`text-sm-m md:text-lg-m ${
                            isSelected
                              ? "text-color-inverse"
                              : "text-color-primary group-hover:text-color-inverse"
                          }`}
                        >
                          {tasklist.name}
                        </span>
                        <span
                          className={`text-md-b md:text-lg-b ${
                            isSelected
                              ? "text-color-inverse"
                              : "text-color-primary group-hover:text-color-inverse"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-[26px] min-h-[400px] md:mt-[28px]">
              <MyTasks processedData={processedData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
