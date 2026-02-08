import React, { useState } from "react";
import Sidebar from "@/components/gnb/Gnb";
import ListCreateModal from "@/components/common/Modal/Contents/ListCreateModal";

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
  title: string;
  commentCount: number;
  date: Date;
  isRecurring: boolean;
  isCompleted: boolean;
}

export default function ListPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  // 날짜 제어 로직
  // 1. 월 단위 변경 (DatePagination용)
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

  // 2. 주 단위 변경 (WeeklyCalendar용)
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

  // --- 더미 데이터 ---
  const [taskGroups, setTaskGroups] = useState([
    { id: 1, name: "법인 설립", current: 3, total: 5 },
    { id: 2, name: "법인 등기", current: 3, total: 5 },
    { id: 3, name: "정기 주총", current: 3, total: 5 },
  ]);

  const tasks: Task[] = [
    {
      id: 1,
      title: "법인 설립 비용 안내 드리기",
      commentCount: 3,
      date: new Date(2024, 6, 29),
      isRecurring: false,
      isCompleted: true,
    },
    {
      id: 2,
      title: "법인 설립 혹은 변경 등기 비용 안내 드리기",
      commentCount: 3,
      date: new Date(2024, 6, 29),
      isRecurring: true,
      isCompleted: false,
    },
    {
      id: 3,
      title: "법인 설립 혹은 변경 등기 비용 안내 드리기",
      commentCount: 3,
      date: new Date(2024, 6, 29),
      isRecurring: true,
      isCompleted: false,
    },
  ];

  // --- 핸들러 함수들 ---
  const handleEditTask = (id: number) =>
    console.log(`테스크 ${id} 수정 모달 오픈`);
  const handleDeleteTask = (id: number) =>
    console.log(`테스크 ${id} 삭제 API 호출`);

  return (
    <div className="bg-background-secondary font-pretendard flex min-h-screen">
      <Sidebar />

      <main className="text-color-primary flex-1 overflow-hidden p-10">
        <div className="mx-auto max-w-300 space-y-6">
          <header className="border-border-primary flex items-center justify-between rounded-xl border bg-white px-6 py-4 shadow-sm">
            <h1 className="text-2xl-b">경영관리팀</h1>
            <SettingsIcon className="text-icon-primary hover:text-color-primary h-5 w-5 cursor-pointer transition-colors" />
          </header>

          <div className="flex gap-8">
            {/* 왼쪽 사이드바 */}
            <aside className="flex w-72 shrink-0 flex-col items-center">
              <h2 className="text-xl-b mb-2 w-full px-1">할 일</h2>

              <div className="mt-6 flex w-full flex-col gap-3">
                {taskGroups.map((group) => (
                  <TaskGroupCard
                    key={group.id}
                    name={group.name}
                    current={group.current}
                    total={group.total}
                    onEdit={() => console.log(`${group.name} 수정`)}
                    onDelete={() =>
                      setTaskGroups(taskGroups.filter((g) => g.id !== group.id))
                    }
                  />
                ))}
              </div>

              <button
                onClick={() => setIsListModalOpen(true)}
                className="text-md-sb text-brand-primary border-brand-primary bg-background-inverse mt-11 flex h-10 w-28 items-center justify-center gap-2 rounded-4xl border shadow-sm"
              >
                <PlusIcon className="h-3.5 w-3.5" /> 할 일 추가
              </button>
            </aside>

            {/* 오른쪽 메인 영역 */}
            <section className="border-border-primary relative min-h-175 flex-1 rounded-[40px] border bg-white p-12 shadow-sm">
              <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl-b text-color-tertiary">법인 등기</h3>
                  <div className="flex items-center gap-4">
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
                  {tasks.map((task) => (
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
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="bg-brand-primary hover:bg-interaction-hover absolute top-1/2 -right-8 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95"
              >
                <PlusIcon className="h-8 w-8 brightness-0 invert filter" />
              </button>
            </section>
          </div>
        </div>
      </main>

      {isListModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsListModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ListCreateModal onClose={() => setIsListModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
