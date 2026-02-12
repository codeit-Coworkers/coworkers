import { useEffect, useRef, useState } from "react";
import Dropdown from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface TaskData {
  title: string;
  startDate: string | null;
  description: string;
  taskListId: string | number;
  groupId: string | number;
  repeatLabel: string;
  isRecurring: boolean;
}

interface TaskCreateModalProps {
  onClose: () => void;
  onCreate: (data: TaskData) => void;
  currentListId: number;
  currentGroupId: number;
}

const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({
  onClose,
  onCreate,
  currentListId,
  currentGroupId,
}: TaskCreateModalProps) {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [selectDay, setSelectDay] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateContainerRef, () => setIsDateOpen(false));
  useClickOutside(timeContainerRef, () => setIsTimeOpen(false));

  const { dateString } = getDateTime();

  // ⭐ Focus Trap 로직 구현
  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // 포커스 가능한 요소들 선택
    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKeyPress = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab: 첫 번째 요소에서 누르면 마지막 요소로 포커스 이동
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: 마지막 요소에서 누르면 첫 번째 요소로 포커스 이동
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    firstElement?.focus();

    window.addEventListener("keydown", handleTabKeyPress);
    return () => window.removeEventListener("keydown", handleTabKeyPress);
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("할 일 제목을 입력해주세요!");
      return;
    }

    let finalStartDate: string | null = null;
    if (date) {
      const combinedDate = new Date(date);
      if (time && time.includes(":")) {
        const timeParts = time.split(" ");
        const hourMin = timeParts.length > 1 ? timeParts[1] : timeParts[0];
        let [hours] = hourMin.split(":").map(Number);
        const [, minutes] = hourMin.split(":").map(Number);

        const isPM = time.includes("오후");
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        combinedDate.setHours(hours, minutes, 0, 0);
      }
      finalStartDate = combinedDate.toISOString();
    }

    onCreate({
      title,
      description: memo,
      startDate: finalStartDate,
      taskListId: currentListId,
      groupId: currentGroupId,
      repeatLabel: selectDay?.label || "반복 안함",
      isRecurring: !!(selectDay && selectDay.label !== "반복 안함"),
    });
    onClose();
  };

  return (
    <div ref={modalRef} tabIndex={-1}>
      <div className="flex flex-col">
        <div className="relative mb-5 flex items-center justify-center">
          <h2 className="text-2lg-b text-color-primary">할 일 만들기</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-color-tertiary absolute right-0"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <p className="text-md-r text-color-default mb-10 text-center">
          할 일은 실제로 행동 가능한 작업 중심으로 <br /> 작성해주시면 좋습니다.
        </p>

        {/* 제목 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary">할 일 제목</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="search"
            placeholder="제목을 입력해주세요."
          />
        </div>

        {/* 시작 날짜 및 시간 */}
        <div className="mb-5 flex flex-col text-left">
          <label className="text-md-sb text-color-primary mb-2">
            시작 날짜 및 시간
          </label>
          <div className="relative flex flex-row gap-2">
            <div className="relative w-3/5" ref={dateContainerRef}>
              <input
                readOnly
                value={date ? getDateTime(date).dateString : ""}
                onClick={() => setIsDateOpen(!isDateOpen)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setIsDateOpen(!isDateOpen)
                }
                className="placeholder-color-default border-border-primary text-md-r focus:ring-brand-primary h-12 w-full cursor-pointer rounded-xl border p-4 outline-none focus:ring-1"
                placeholder={dateString}
              />
              {isDateOpen && (
                <div className="animate-fadeDown ring-brand-primary bg-background-primary absolute top-14 left-0 z-99 flex w-100 items-center justify-center rounded-xl pb-2 shadow-2xl ring-1">
                  <CalendarDate
                    selectedDate={date}
                    onSelectDate={(d) => {
                      setDate(d);
                      setIsDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="relative w-2/5" ref={timeContainerRef}>
              <input
                readOnly
                value={time}
                onClick={() => setIsTimeOpen(!isTimeOpen)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setIsTimeOpen(!isTimeOpen)
                }
                className="placeholder-color-default border-border-primary text-md-r focus:ring-brand-primary h-12 w-full cursor-pointer rounded-xl border p-4 outline-none focus:ring-1"
                placeholder="시간 선택"
              />
              {isTimeOpen && (
                <div className="animate-fadeDown ring-brand-primary bg-background-primary absolute top-14 right-0 z-99 flex w-100 items-center justify-center rounded-xl p-4 shadow-2xl ring-1">
                  <CalendarTime
                    selectedTime={time}
                    onSelectTime={(t) => {
                      setTime(t);
                      setIsTimeOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 반복 설정 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary">반복 설정</label>
          <div className="w-32.5">
            <Dropdown
              optionsKey="repeat"
              defaultLabel="반복 안함"
              onSelect={(item) => {
                setSelectDay(item);
                setSelectedDays([]);
              }}
            />
          </div>
        </div>

        {/* 반복 요일 */}
        {(selectDay?.label === "주 반복" || selectDay?.label === "월 반복") && (
          <div className="animate-fadeDown mb-5 flex flex-col gap-2">
            <label className="text-md-sb text-color-primary">반복 요일</label>
            <ul className="flex flex-row justify-between">
              {weekDays.map((item) => (
                <li
                  key={item}
                  tabIndex={0} // 키보드로 접근 가능하게 설정
                  onClick={() => toggleDay(item)}
                  onKeyDown={(e) => e.key === "Enter" && toggleDay(item)}
                  className={`text-sm-m focus:ring-brand-primary flex h-11 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all outline-none focus:ring-2 ${
                    selectedDays.includes(item)
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "text-color-primary border-border-primary hover:bg-background-secondary"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-10 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary">할 일 메모</label>
          <Input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            size="content"
            placeholder="메모를 입력해주세요."
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-brand-primary text-lg-b focus:ring-brand-primary/50 h-12 w-full rounded-xl text-white transition-all outline-none focus:ring-4 active:scale-[0.98]"
      >
        만들기
      </button>
    </div>
  );
}
