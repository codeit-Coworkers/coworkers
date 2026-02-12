import { useRef, useState } from "react";
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

  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateContainerRef, () => setIsDateOpen(false));
  useClickOutside(timeContainerRef, () => setIsTimeOpen(false));

  const { dateString } = getDateTime();

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
    <div className="font-pretendard bg-background-primary w-93.75 rounded-2xl p-6 shadow-xl md:w-112.5">
      <div className="flex flex-col">
        <div className="relative mb-5 flex items-center justify-center">
          <h2 className="text-2lg-b text-color-primary">할 일 만들기</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-color-tertiary absolute right-0"
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
                  onClick={() => toggleDay(item)}
                  className={`text-sm-m flex h-11 w-12 cursor-pointer items-center justify-center rounded-xl border transition-all ${
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
        className="bg-brand-primary text-lg-b h-12 w-full rounded-xl text-white transition-all active:scale-[0.98]"
      >
        만들기
      </button>
    </div>
  );
}
