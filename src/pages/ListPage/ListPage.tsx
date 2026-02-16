import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient, HttpError } from "@/lib/fetchClient";
import { BASE_URL } from "@/api/config";

import Modal from "@/components/common/Modal/Modal";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
import TaskCreateModal, {
  TaskData,
} from "@/components/common/Modal/Contents/TaskCreateModal";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import DatePagination from "./components/DatePagination";
import CalendarPicker from "./components/CalendarPicker";
import TaskCard from "./components/TaskCard";
import { TaskGroupCard } from "./components/TaskGroupCard";

import PlusIcon from "@/assets/plus_blue.svg";
import SettingsIcon from "@/assets/settings.svg";
import ArrowDown from "@/assets/arrow-down.svg";
import Loading from "@/assets/progress-ongoing.svg";
import LoadingDone from "@/assets/progress-done.svg";

import { useDeleteTaskList } from "@/api/tasklist";
import { getTasks, createTask, updateTask, deleteTask } from "@/api/task";
import { useToastStore } from "@/stores/useToastStore";
import { TaskServer } from "@/types/task";

// --- 타입 정의 ---
interface CreateTaskParams {
  name: string;
  description: string;
  startDate: string;
  frequencyType: "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
}

interface TaskListResponse {
  id: number;
  name: string;
  displayIndex: number;
  tasks: TaskServer[];
}

interface UITask extends Omit<TaskServer, "name"> {
  title: string;
  isCompleted: boolean;
}

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ListPage() {
  const queryClient = useQueryClient();
  const { show: showToast } = useToastStore();

  // 1. URL 파라미터 추출 및 숫자 변환
  const { groupId } = useParams<{ groupId: string }>();
  const selectedGroupId = Number(groupId);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userSelectedListId, setUserSelectedListId] = useState<number | null>(
    null,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // 그룹 할 일 목록 조회 (404 방어 로직 포함)
  const { data: taskGroups = [] } = useQuery({
    queryKey: ["taskLists", selectedGroupId],
    queryFn: async () => {
      try {
        return await fetchClient<TaskListResponse[]>(
          `${BASE_URL}/groups/${selectedGroupId}/task-lists`,
          {
            method: "GET",
          },
        );
      } catch (error: unknown) {
        if (error instanceof HttpError && error.status === 404) {
          console.warn("해당 그룹에 등록된 할 일 목록이 없습니다.");
          return [];
        }
        throw error;
      }
    },
    enabled: !!selectedGroupId && !isNaN(selectedGroupId),
  });

  // 2. 현재 선택된 리스트 ID 계산 (목록이 생기면 자동으로 첫 번째 것을 선택)
  const currentListId =
    userSelectedListId ?? (taskGroups.length > 0 ? taskGroups[0].id : null);
  const dateParam = `${formatDateToYYYYMMDD(selectedDate)}T00:00:00Z`;

  // 할 일 리스트 조회
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", currentListId, dateParam],
    queryFn: () => getTasks(selectedGroupId, currentListId!, dateParam),
    enabled: !!currentListId && !!selectedGroupId,
    select: (data: TaskServer[]): UITask[] =>
      data.map((task) => ({
        ...task,
        title: task.name,
        isCompleted: !!task.doneAt,
      })),
    staleTime: 1000 * 60,
  });

  const { mutate: deleteList } = useDeleteTaskList(selectedGroupId);

  const createTaskMutation = useMutation({
    mutationFn: (data: { taskListId: number; body: CreateTaskParams }) => {
      return createTask(data.taskListId, {
        title: data.body.name,
        description: data.body.description,
        date: data.body.startDate,
        frequencyType:
          data.body.frequencyType === "ONCE" ? "NONE" : data.body.frequencyType,
      } as Parameters<typeof createTask>[1]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentListId] });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedGroupId],
      });
      setIsTaskModalOpen(false);
      showToast("할 일이 추가되었습니다.");
    },
    onError: () => showToast("할 일 추가에 실패했습니다."),
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, doneAt }: { id: number; doneAt: string | null }) =>
      updateTask(id, { doneAt } as Parameters<typeof updateTask>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentListId] });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedGroupId],
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", currentListId] });
      queryClient.invalidateQueries({
        queryKey: ["taskLists", selectedGroupId],
      });
      showToast("할 일이 삭제되었습니다.");
    },
  });

  const handleCreateTask = (data: TaskData) => {
    const frequencyMap: Record<
      string,
      "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE"
    > = {
      매일: "DAILY",
      "주 반복": "WEEKLY",
      "월 반복": "MONTHLY",
      "반복 안함": "ONCE",
    };

    const payload: CreateTaskParams = {
      name: data.title,
      description: data.description,
      startDate: data.startDate || new Date().toISOString(),
      frequencyType: frequencyMap[data.repeatLabel] || "ONCE",
    };

    if (currentListId) {
      createTaskMutation.mutate({
        taskListId: Number(data.taskListId),
        body: payload,
      });
    }
  };

  const handleDeleteList = (listId: number) => {
    if (confirm("정말 이 목록을 삭제하시겠습니까?")) {
      deleteList(listId);
      setUserSelectedListId(null);
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  const handleWeekChange = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target))
        setIsDropdownOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(target))
        setShowCalendar(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!groupId || isNaN(selectedGroupId)) {
    return (
      <div className="bg-background-secondary flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold">올바르지 않은 접근입니다.</p>
          <p className="text-color-tertiary mt-2">그룹 ID를 확인해 주세요.</p>
        </div>
      </div>
    );
  }

  // 3. Optional Chaining 강화 (데이터가 없을 때 필터 오류 방지)
  const activeGroup = taskGroups.find((g) => g.id === currentListId) || {
    name: "목록 없음",
    id: -1,
    tasks: [],
  };
  const currentCount = (activeGroup.tasks ?? []).filter(
    (t) => !!t.doneAt,
  ).length;
  const totalCount = (activeGroup.tasks ?? []).length;

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen flex-col lg:flex-row">
      <main className="text-color-primary flex-1 p-4 md:p-6 lg:p-10">
        <div className="mx-auto max-w-full space-y-6 lg:max-w-300">
          <header className="lg:border-border-primary lg:bg-background-inverse text-2xl-b mb-6 flex items-center rounded-xl py-3 md:mb-12 md:py-4 lg:justify-between lg:border lg:px-4 lg:shadow-sm">
            {/* API에서 팀 이름을 가져오기 전까지는 '팀 목록' 등으로 표시 가능 */}
            <h1 className="md:text-2xl-b text-xl font-bold">
              {activeGroup.name !== "목록 없음"
                ? activeGroup.name
                : "할 일 목록"}
            </h1>
            <SettingsIcon className="text-icon-primary ml-2.5 h-5 w-5 cursor-pointer" />
          </header>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <aside className="flex w-full shrink-0 flex-col lg:w-72">
              <div className="flex flex-col gap-4">
                <h2 className="md:text-xl-b text-lg-sb lg:text-xl-b px-1 font-bold">
                  할 일
                </h2>
                {/* 모바일 뷰 드롭다운 */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <div className="relative max-w-50 flex-1" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="border-border-primary flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-color-primary text-sm-sb">
                          {activeGroup.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {currentCount === totalCount && totalCount > 0 ? (
                            <LoadingDone className="h-4 w-4" />
                          ) : (
                            <Loading className="h-4 w-4" />
                          )}
                          <span className="text-brand-primary text-md-r">
                            {currentCount}/{totalCount}
                          </span>
                        </div>
                      </div>
                      <ArrowDown
                        className={`text-icon-primary h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isDropdownOpen && (
                      <ul className="border-border-primary animate-in fade-in slide-in-from-top-1 absolute z-70 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-2xl">
                        {taskGroups.map((group) => (
                          <li
                            key={group.id}
                            onClick={() => {
                              setUserSelectedListId(group.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`hover:bg-background-secondary cursor-pointer px-4 py-3 text-sm transition-colors ${currentListId === group.id ? "text-brand-primary bg-blue-50 font-bold" : "text-color-primary"}`}
                          >
                            {group.name} (
                            {
                              (group.tasks ?? []).filter((t) => !!t.doneAt)
                                .length
                            }
                            /{(group.tasks ?? []).length})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="border-brand-primary text-brand-primary text-sm-sb bg-background-inverse flex shrink-0 items-center gap-1.5 rounded-4xl border px-4 py-3 shadow-sm transition-all active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />할 일 추가
                  </button>
                </div>
              </div>

              {/* 데스크탑 사이드바 목록 */}
              <div className="mt-6 hidden w-full flex-col gap-3 lg:flex">
                <p className="text-xs text-red-500">
                  불러온 목록 개수: {taskGroups?.length || 0}
                </p>
                {taskGroups.map((group) => (
                  <TaskGroupCard
                    key={group.id}
                    name={group.name}
                    current={
                      (group.tasks ?? []).filter((t) => !!t.doneAt).length
                    }
                    total={(group.tasks ?? []).length}
                    isActive={currentListId === group.id}
                    onClick={() => setUserSelectedListId(group.id)}
                    onEdit={() => console.log("수정")}
                    onDelete={() => handleDeleteList(group.id)}
                  />
                ))}
                <div className="mt-4 flex w-full items-center justify-center">
                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="border-brand-primary text-brand-primary text-sm-sb bg-background-inverse hover:bg-brand-primary group flex h-10 w-28 items-center justify-center gap-1.5 rounded-4xl border shadow-sm transition-all hover:text-white active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5 group-hover:brightness-0 group-hover:invert" />
                    할 일 목록 추가
                  </button>
                </div>
              </div>
            </aside>

            {/* 메인 섹션 */}
            <section className="border-border-primary relative min-h-125 flex-1 rounded-xl border bg-white p-6 shadow-sm md:p-8 lg:p-12">
              <div className="mx-auto max-w-full space-y-8 lg:max-w-3xl">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <h3 className="md:text-2xl-b text-color-tertiary text-xl font-bold">
                    {activeGroup.name}
                  </h3>
                  <div className="flex items-center gap-1 self-end md:self-auto">
                    <DatePagination
                      selectedDate={selectedDate}
                      onPrevMonth={() => handleMonthChange("prev")}
                      onNextMonth={() => handleMonthChange("next")}
                    />
                    <div ref={calendarRef} className="relative">
                      <CalendarPicker
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        showCalendar={showCalendar}
                        setShowCalendar={setShowCalendar}
                      />
                    </div>
                  </div>
                </div>
                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onPrevWeek={() => handleWeekChange("prev")}
                  onNextWeek={() => handleWeekChange("next")}
                />

                <div className="flex flex-col gap-3">
                  {isTasksLoading ? (
                    <div className="py-20 text-center text-gray-400">
                      로딩 중...
                    </div>
                  ) : tasks.length > 0 ? (
                    tasks.map((task: UITask) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        isCompleted={task.isCompleted}
                        commentCount={task.commentCount}
                        date={new Date(task.date)}
                        time={null}
                        repeatLabel={
                          task.frequency === "DAILY"
                            ? "매일"
                            : task.frequency === "WEEKLY"
                              ? "주 반복"
                              : task.frequency === "MONTHLY"
                                ? "월 반복"
                                : ""
                        }
                        isRecurring={task.frequency !== "ONCE"}
                        onToggle={() =>
                          toggleTaskMutation.mutate({
                            id: task.id,
                            doneAt: task.doneAt
                              ? null
                              : new Date().toISOString(),
                          })
                        }
                        onDelete={() => {
                          if (confirm("할 일을 삭제하시겠습니까?"))
                            deleteTaskMutation.mutate(task.id);
                        }}
                        onEdit={() => console.log("수정 모달 연결 필요")}
                      />
                    ))
                  ) : (
                    <div className="text-color-disabled flex flex-col items-center justify-center py-24 text-center">
                      <p>해당 날짜에 등록된 할 일이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-brand-primary fixed right-6 bottom-6 z-10 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95 md:h-16 md:w-16 lg:absolute lg:top-1/2 lg:-right-8 lg:bottom-auto lg:-translate-y-1/2"
              >
                <PlusIcon className="h-6 w-6 brightness-0 invert filter md:h-8 md:w-8" />
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* 모달 영역 */}
      {(isListModalOpen || isTaskModalOpen) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsListModalOpen(false);
            setIsTaskModalOpen(false);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg px-4"
          >
            {isListModalOpen && (
              <Modal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
              >
                <ListCreateModal
                  groupId={selectedGroupId}
                  onClose={() => setIsListModalOpen(false)}
                />
              </Modal>
            )}
            {isTaskModalOpen && (
              <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
              >
                <TaskCreateModal
                  onClose={() => setIsTaskModalOpen(false)}
                  onCreate={handleCreateTask}
                  currentListId={currentListId || 0}
                  currentGroupId={selectedGroupId}
                />
              </Modal>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
