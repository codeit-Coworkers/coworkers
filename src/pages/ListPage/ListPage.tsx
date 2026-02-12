import React, { useState, useRef, useEffect } from "react";
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

// --- 타입 정의 ---
interface Task {
  id: number;
  taskListId: string | number;
  groupId: string | number;
  title: string;
  commentCount: number;
  date: Date;
  time?: string | null;
  repeatLabel?: string;
  isRecurring: boolean;
  isCompleted: boolean;
  memo?: string;
}

export default function ListPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedGroupId] = useState<number>(666);
  const [selectedListId, setSelectedListId] = useState<number>(1);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const [taskGroups, setTaskGroups] = useState([
    { id: 1, name: "법인 설립", current: 3, total: 5 },
    { id: 2, name: "법인 등기", current: 3, total: 5 },
    { id: 3, name: "정기 주총", current: 3, total: 5 },
  ]);

  const [allTasks, setAllTasks] = useState<Task[]>([
    {
      id: 1,
      taskListId: "1",
      groupId: "666",
      title: "법인 설립 비용 안내 드리기",
      commentCount: 3,
      date: new Date(),
      repeatLabel: "매일",
      isRecurring: true,
      isCompleted: true,
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateTask = (data: TaskData) => {
    const taskDate = data.startDate ? new Date(data.startDate) : selectedDate;
    const newTask: Task = {
      id: Date.now(),
      taskListId: data.taskListId,
      groupId: data.groupId,
      title: data.title,
      commentCount: 0,
      date: taskDate,
      repeatLabel: data.repeatLabel,
      isRecurring: data.isRecurring,
      isCompleted: false,
      memo: data.description,
    };
    setAllTasks((prev) => [...prev, newTask]);
    setIsTaskModalOpen(false);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  const handleWeekChange = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(newDate);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50)
      handleWeekChange(distance > 0 ? "next" : "prev");
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const activeGroup =
    taskGroups.find((g) => g.id === selectedListId) || taskGroups[0];
  const filteredTasks = allTasks.filter(
    (task) =>
      Number(task.taskListId) === selectedListId &&
      isSameDay(new Date(task.date), selectedDate),
  );

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen flex-col lg:flex-row">
      <main className="text-color-primary flex-1 p-4 md:p-6 lg:p-10">
        <div className="mx-auto max-w-full space-y-6 lg:max-w-300">
          {/* 헤더 */}
          <header className="lg:border-border-primary lg:bg-background-inverse text-2xl-b mb-6 flex items-center rounded-xl py-3 md:mb-12 md:py-4 lg:justify-between lg:border lg:px-4 lg:shadow-sm">
            <h1 className="md:text-2xl-b text-xl font-bold">경영관리팀</h1>
            <SettingsIcon className="text-icon-primary ml-2.5 h-5 w-5 cursor-pointer" />
          </header>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <aside className="flex w-full shrink-0 flex-col lg:w-72">
              <div className="flex flex-col gap-4">
                {/* 제목 라인 */}
                <h2 className="md:text-xl-b text-lg-sb lg:text-lg-sb px-1">
                  할 일
                </h2>

                {/* 드롭다운 & 할 일 추가 버튼 라인 (모바일 전용) */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  {/* 드롭다운 메뉴 */}
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
                          {activeGroup.current === activeGroup.total ? (
                            <LoadingDone className="h-4 w-4" />
                          ) : (
                            <Loading className="h-4 w-4" />
                          )}
                          <span className="text-brand-primary text-md-r">
                            {activeGroup.current}/{activeGroup.total}
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
                              setSelectedListId(group.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`hover:bg-background-secondary cursor-pointer px-4 py-3 text-sm transition-colors ${selectedListId === group.id ? "text-brand-primary bg-blue-50 font-bold" : "text-color-primary"}`}
                          >
                            {group.name} ({group.current}/{group.total})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* 할 일 추가 버튼 */}
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="border-brand-primary text-brand-primary text-sm-sb bg-background-inverse flex shrink-0 items-center gap-1.5 rounded-4xl border px-4 py-3 shadow-sm transition-all active:scale-95"
                  >
                    <PlusIcon className="h-3.5 w-3.5" />할 일 추가
                  </button>
                </div>
              </div>

              {/* 데스크탑 리스트 카드 (데스크탑에서만 보임) */}
              <div className="mt-6 hidden w-full flex-col gap-3 lg:flex">
                {taskGroups.map((group) => (
                  <TaskGroupCard
                    key={group.id}
                    {...group}
                    isActive={selectedListId === group.id}
                    onClick={() => setSelectedListId(group.id)}
                    onEdit={() => console.log("수정")}
                    onDelete={() =>
                      setTaskGroups((prev) =>
                        prev.filter((g) => g.id !== group.id),
                      )
                    }
                  />
                ))}
                <button
                  onClick={() => setIsListModalOpen(true)}
                  className="group text-md-sb text-brand-primary border-brand-primary hover:bg-brand-primary mt-11 flex h-10 w-full items-center justify-center gap-2 rounded-xl border transition-all hover:text-white"
                >
                  <PlusIcon className="h-3.5 w-3.5 group-hover:brightness-0 group-hover:invert" />
                  목록 추가
                </button>
              </div>
            </aside>

            {/* 메인 섹션 */}
            <section
              className="border-border-primary relative min-h-125 flex-1 rounded-xl border bg-white p-6 shadow-sm md:p-8 lg:p-12"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
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
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      showCalendar={showCalendar}
                      setShowCalendar={setShowCalendar}
                    />
                  </div>
                </div>

                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onPrevWeek={() => handleWeekChange("prev")}
                  onNextWeek={() => handleWeekChange("next")}
                />

                <div className="flex flex-col gap-3">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        {...task}
                        repeatLabel={
                          task.repeatLabel && task.repeatLabel !== "반복 안함"
                            ? `${task.repeatLabel} 반복`
                            : ""
                        }
                        onToggle={() => {}}
                      />
                    ))
                  ) : (
                    <div className="text-color-disabled flex flex-col items-center justify-center py-24 text-center">
                      <p>해당 날짜에 등록된 할 일이 없습니다.</p>
                      <p className="text-color-tertiary mt-2 text-sm font-medium md:hidden">
                        좌우로 밀어서 주간을 이동해보세요.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Action Button */}
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

      {/* 모달 배경 및 컴포넌트 */}
      {(isListModalOpen || isTaskModalOpen) && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setIsListModalOpen(false);
            setIsTaskModalOpen(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            {isListModalOpen && (
              <ListCreateModal
                groupId={selectedGroupId}
                onClose={() => setIsListModalOpen(false)}
              />
            )}
            {isTaskModalOpen && (
              <TaskCreateModal
                onClose={() => setIsTaskModalOpen(false)}
                onCreate={handleCreateTask}
                currentListId={selectedListId}
                currentGroupId={selectedGroupId}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
