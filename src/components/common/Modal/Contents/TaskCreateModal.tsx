import { useRef, useState, useId, useEffect } from "react";
import Dropdown, { Option } from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

interface TaskData {
  title: string;
  date: Date | null;
  time: string | null;
  repeat: string;
  selectedDays: string[];
  memo: string;
}

interface TaskCreateModalProps {
  onClose: () => void;
  onCreate: (data: TaskData) => void;
}

const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({
  onClose,
  onCreate,
}: TaskCreateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null); // 포커스 트랩을 위한 ref
  const dateInputId = useId(); // 접근성을 위한 고유 ID
  const timeInputId = useId();

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dateInputValue, setDateInputValue] = useState(""); // 날짜 직접 입력 상태
  const [time, setTime] = useState(""); // 시간 직접 입력 상태
  const [selectDay, setSelectDay] = useState<Option | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // 클릭 외부 감지를 위한 컨테이너 ref (버블링 방지)
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLDivElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null); // 엔터 시 포커스 이동용

  useClickOutside(dateContainerRef, () => setIsDateOpen(false));
  useClickOutside(timeContainerRef, () => setIsTimeOpen(false));

  const { dateString } = getDateTime();

  // 1. 모달 포커스 트랩: 탭 이동이 모달 밖으로 나가지 않게 제어
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. 시간 포맷팅: 24시간제 입력 시 오전/오후 12시간제로 자동 변환
  const handleTimeBlur = () => {
    if (!time) return;
    const cleanTime = time.replace(/[^0-9:]/g, "");
    const timeRegex = /^([0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

    if (timeRegex.test(cleanTime)) {
      const [hoursStr, minutes] = cleanTime.split(":");
      let hours = parseInt(hoursStr, 10);
      const ampm = hours >= 12 ? "오후" : "오전";
      hours = hours % 12 || 12;
      setTime(`${ampm} ${String(hours).padStart(2, "0")}:${minutes}`);
    }
  };

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
    // 상위 ListPage의 handleCreateTask로 데이터 전송
    onCreate({
      title,
      date,
      time: time || null,
      repeat: selectDay?.label || "반복 안함",
      selectedDays,
      memo,
    });
    onClose();
  };

  return (
    <div
      ref={modalRef}
      className="font-pretendard bg-background-primary w-93.75 rounded-2xl p-6 shadow-xl md:w-112.5"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col">
        {/* 모달 헤더 */}
        <div className="relative mb-5 flex items-center justify-center">
          <h2 className="text-2lg-b text-color-primary">할 일 만들기</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-color-tertiary hover:text-brand-primary absolute right-0 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <p className="text-md-r text-color-default mb-10 text-center">
          할 일은 실제로 행동 가능한 작업 중심으로
          <br />
          작성해주시면 좋습니다.
        </p>

        {/* 할 일 제목 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="todoTitle">
            할 일 제목
          </label>
          <Input
            id="todoTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="search"
            placeholder="할 일 제목을 입력해주세요."
          />
        </div>

        {/* 시작 날짜 및 시간: 직접 입력 및 엔터 조작 */}
        <div className="mb-5 flex flex-col text-left">
          <label className="text-md-sb text-color-primary mb-2">
            시작 날짜 및 시간
          </label>
          <div className="relative flex flex-row gap-2">
            {/* 날짜 입력부 */}
            <div className="contents" ref={dateContainerRef}>
              <input
                id={dateInputId}
                type="text"
                value={
                  dateInputValue || (date ? getDateTime(date).dateString : "")
                }
                onChange={(e) => setDateInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!dateInputValue && !date) {
                      setIsDateOpen(true); // 비어있으면 캘린더 오픈
                    } else {
                      setIsDateOpen(false); // 입력값이 있으면 시간창으로 이동
                      timeInputRef.current?.focus();
                    }
                  }
                }}
                className="placeholder-color-default text-color-default border-border-primary text-md-r focus:ring-brand-primary h-12 w-3/5 rounded-xl border border-solid p-4 focus:ring-1 focus:outline-none"
                placeholder={dateString}
              />
              {isDateOpen && (
                <div className="animate-fadeDown ring-brand-primary bg-background-primary absolute top-14 left-0 z-99 flex w-full items-center justify-center rounded-xl pb-2 shadow-2xl ring-1">
                  <CalendarDate
                    selectedDate={date}
                    onSelectDate={(d) => {
                      setDate(d);
                      setDateInputValue("");
                      setIsDateOpen(false);
                    }}
                  />
                </div>
              )}
            </div>

            {/* 시간 입력부 */}
            <div className="contents" ref={timeContainerRef}>
              <input
                ref={timeInputRef}
                id={timeInputId}
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                onBlur={handleTimeBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!time)
                      setIsTimeOpen(true); // 비어있으면 피커 오픈
                    else setIsTimeOpen(false);
                  }
                }}
                className="placeholder-color-default text-color-default border-border-primary text-md-r focus:ring-brand-primary h-12 w-2/5 rounded-xl border border-solid p-4 focus:ring-1 focus:outline-none"
                placeholder="14:30"
              />
              {isTimeOpen && (
                <div className="animate-fadeDown ring-brand-primary bg-background-primary absolute top-14 right-0 z-99 flex w-full items-center justify-center rounded-xl p-4 shadow-2xl ring-1">
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

        {/* 반복 설정: 엔터 조작 지원 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary">반복 설정</label>
          <div
            ref={dropdownTriggerRef}
            tabIndex={0}
            role="button"
            className="focus:ring-brand-primary w-32.5 cursor-pointer rounded-xl transition-all outline-none focus:ring-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const target = dropdownTriggerRef.current
                  ?.firstChild as HTMLElement;
                target?.click();
              }
            }}
          >
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
              {weekDays.map((item) => {
                const isSelected = selectedDays.includes(item);
                return (
                  <li
                    key={item}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleDay(item);
                      }
                    }}
                    onClick={() => toggleDay(item)}
                    className={`text-sm-m focus:ring-brand-primary flex h-11 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 outline-none select-none focus:ring-2 ${
                      isSelected
                        ? "bg-brand-primary text-color-inverse border-brand-primary"
                        : "text-color-primary border-border-primary hover:bg-background-secondary"
                    }`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 할 일 메모 입력 */}
        <div className="mb-10 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="todoMemo">
            할 일 메모
          </label>
          <Input
            id="todoMemo"
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
        className="bg-brand-primary text-lg-b text-color-inverse hover:bg-interaction-hover active:bg-interaction-pressed h-12 w-full rounded-xl text-center transition-all active:scale-[0.98]"
      >
        만들기
      </button>
    </div>
  );
}
