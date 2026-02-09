import React, { useState } from "react";
import Sidebar from "@/components/gnb/Gnb";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";
import TaskCreateModal from "@/components/common/Modal/Contents/TaskCreateModal";

// 하위 컴포넌트들
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import DatePagination from "./components/DatePagination";
import CalendarPicker from "./components/CalendarPicker";
import TaskCard from "./components/TaskCard";
import { TaskGroupCard } from "./components/TaskGroupCard";

// 아이콘 및 에셋 설정
import PlusIcon from "@/assets/plus_blue.svg";
import SettingsIcon from "@/assets/settings.svg";

// --- 타입 정의 ---
interface Task {
  id: number;
  groupId: number; // 그룹 식별자
  title: string;
  commentCount: number;
  date: Date;
  isRecurring: boolean;
  isCompleted: boolean;
}

export default function ListPage() {
  // --- 상태 관리 ---
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(2);

  // --- 날짜 제어 로직 ---
  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // --- 데이터 영역 (임시 데이터) ---
  const [taskGroups, setTaskGroups] = useState([
    { id: 1, name: "법인 설립", current: 3, total: 5 },
    { id: 2, name: "법인 등기", current: 3, total: 5 },
    { id: 3, name: "정기 주총", current: 3, total: 5 },
  ]);

  const tasks: Task[] = [
    {
      id: 1,
      groupId: 1,
      title: "법인 설립 비용 안내 드리기",
      commentCount: 3,
      date: new Date(), // 오늘 날짜
      isRecurring: false,
      isCompleted: true,
    },
    {
      id: 2,
      groupId: 2,
      title: "법인 설립 혹은 변경 등기 비용 안내 드리기",
      commentCount: 3,
      date: new Date(), // 오늘 날짜
      isRecurring: true,
      isCompleted: false,
    },
    {
      id: 3,
      groupId: 2,
      title: "법인 등기 서류 준비하기",
      commentCount: 0,
      date: new Date(2026, 1, 15), // 2026년 2월 15일
      isRecurring: false,
      isCompleted: false,
    },
  ];

  // --- 유틸리티: 날짜 비교 (시/분/초 제외) ---
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // --- 필터링 로직 ---
  const activeGroup =
    taskGroups.find((g) => g.id === selectedGroupId) || taskGroups[0];

  // 그룹 ID와 날짜가 모두 일치하는 테스크만 추출
  const filteredTasks = tasks.filter(
    (task) =>
      task.groupId === selectedGroupId && isSameDay(task.date, selectedDate),
  );

  // --- 핸들러 함수들 ---
  const handleEditTask = (id: number) => console.log(`테스크 ${id} 수정`);
  const handleDeleteTask = (id: number) => console.log(`테스크 ${id} 삭제`);

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen">
      <div className="bg-background-inverse">
        <Sidebar />
      </div>

      <main className="text-color-primary flex-1 overflow-hidden p-10">
        <div className="mx-auto max-w-300 space-y-6">
          <header className="border-border-primary mb-12 flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm">
            <h1 className="text-2xl-b">경영관리팀</h1>
            <SettingsIcon className="text-icon-primary hover:text-color-primary h-5 w-5 cursor-pointer transition-colors" />
          </header>

          <div className="flex gap-8">
            {/* 왼쪽 사이드바: 그룹 목록 */}
            <aside className="flex w-72 shrink-0 flex-col items-center">
              <h2 className="text-xl-b mb-2 w-full px-1">할 일</h2>
              <div className="mt-6 flex w-full flex-col gap-3">
                {taskGroups.map((group) => (
                  <TaskGroupCard
                    key={group.id}
                    name={group.name}
                    current={group.current}
                    total={group.total}
                    onClick={() => setSelectedGroupId(group.id)}
                    onEdit={() => console.log(`${group.name} 수정`)}
                    onDelete={() =>
                      setTaskGroups(taskGroups.filter((g) => g.id !== group.id))
                    }
                  />
                ))}
              </div>
              <button
                onClick={() => setIsListModalOpen(true)}
                className="group text-md-sb text-brand-primary border-brand-primary bg-background-inverse hover:bg-brand-primary mt-11 flex h-10 w-28 items-center justify-center gap-2 rounded-4xl border shadow-sm transition-all duration-200 hover:text-white active:scale-95"
              >
                <PlusIcon className="h-3.5 w-3.5 transition-all duration-200 group-hover:brightness-0 group-hover:invert" />
                할 일 추가
              </button>
            </aside>

            {/* 오른쪽 메인 영역: 상세 목록 */}
            <section className="border-border-primary relative min-h-175 flex-1 rounded-xl border bg-white p-12 shadow-sm">
              <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl-b text-color-tertiary">
                    {activeGroup.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <DatePagination
                      selectedDate={selectedDate}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
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
                  onPrevWeek={handlePrevWeek}
                  onNextWeek={handleNextWeek}
                />

                <div className="flex flex-col gap-3">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        commentCount={task.commentCount}
                        date={task.date}
                        isRecurring={task.isRecurring}
                        isCompleted={task.isCompleted}
                        onToggle={() => console.log(`${task.id} 토글`)}
                        onEdit={() => handleEditTask(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))
                  ) : (
                    <div className="text-color-disabled flex flex-col items-center justify-center py-24">
                      <p>해당 날짜에 등록된 할 일이 없습니다.</p>
                      <p className="mt-1 text-sm">
                        새로운 할 일을 추가해보세요!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-brand-primary hover:bg-interaction-hover absolute top-1/2 -right-8 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95"
              >
                <PlusIcon className="h-8 w-8 brightness-0 invert filter" />
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* --- 모달 영역 --- */}
      {isListModalOpen && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
          onClick={() => setIsListModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ListCreateModal onClose={() => setIsListModalOpen(false)} />
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
          onClick={() => setIsTaskModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TaskCreateModal onClose={() => setIsTaskModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
