import { useRef, useState } from "react";
import Dropdown, { Option } from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

/**
 * @interface TaskCreateModalProps
 * @property {() => void} onClose - 모달을 닫는 함수입니다.
 */
interface TaskCreateModalProps {
  onClose: () => void;
}

const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

export default function TaskCreateModal({ onClose }: TaskCreateModalProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const dateLayerRef = useRef<HTMLDivElement>(null);
  const timeLayerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateLayerRef, () => setIsDateOpen(false));
  useClickOutside(timeLayerRef, () => setIsTimeOpen(false));

  const [selectDay, setSelectDay] = useState<Option | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const formattedDate = date ? getDateTime(date).dateString : "";
  const { dateString, timeString } = getDateTime();

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  return (
    <div className="font-pretendard w-93.75 rounded-2xl bg-white p-6 shadow-xl md:w-112.5">
      <div className="flex flex-col">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg-m text-color-primary">할 일 만들기</h2>
          {/* 우측 상단 닫기 버튼 (X 아이콘 등으로 대체 가능) */}
          <button
            onClick={onClose}
            className="text-color-tertiary hover:text-color-primary"
          >
            취소
          </button>
        </div>

        <p className="text-md-r text-color-default mb-10">
          할 일은 실제로 행동 가능한 작업 중심으로
          <br /> 작성해주시면 좋습니다.
        </p>

        {/* 할 일 제목 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="todoTitle">
            할 일 제목
          </label>
          <Input
            size="search"
            className="border-none ring-1 ring-[#e2e8f0]"
            placeholder="할 일 제목을 입력해주세요."
          />
        </div>

        {/* 시작 날짜 및 시간 */}
        <div className="mb-5 flex flex-col text-left">
          <label
            htmlFor="startAt"
            className="text-md-sb text-color-primary mb-2"
          >
            시작 날짜 및 시간
          </label>
          <div className="relative flex flex-row gap-2">
            <input
              id="startAtDate"
              type="text"
              value={formattedDate}
              readOnly
              onClick={() => setIsDateOpen((item) => !item)}
              className="placeholder-color-default text-color-default h-12 w-3/5 cursor-pointer rounded-xl border border-solid border-[#e2e8f0] p-4 text-sm caret-transparent"
              placeholder={dateString}
            />
            <input
              id="startAtTime"
              type="text"
              value={time ?? ""}
              readOnly
              onClick={() => {
                setIsTimeOpen((prev) => !prev);
                setIsDateOpen(false);
              }}
              className="placeholder-color-default text-color-default h-12 w-2/5 cursor-pointer rounded-xl border border-solid border-[#e2e8f0] p-4 text-sm caret-transparent"
              placeholder={timeString}
            />
          </div>

          {/* 캘린더/타임 피커 레이어 */}
          <div className="relative">
            {isDateOpen && (
              <div
                className="absolute top-2 left-0 z-100 rounded-xl border border-gray-100 bg-white p-2 shadow-2xl"
                ref={dateLayerRef}
              >
                <CalendarDate
                  selectedDate={date}
                  onSelectDate={(date) => {
                    setDate(date);
                    setIsDateOpen(false);
                  }}
                />
              </div>
            )}
            {isTimeOpen && (
              <div
                className="absolute top-2 right-0 z-100 rounded-xl border border-gray-100 bg-white p-2 shadow-2xl"
                ref={timeLayerRef}
              >
                <CalendarTime
                  selectedTime={time}
                  onSelectTime={(time) => {
                    setTime(time);
                    setIsTimeOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 반복 설정 */}
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="repeat">
            반복 설정
          </label>
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

        {/* 반복 요일 (조건부 렌더링) */}
        {(selectDay?.label === "주 반복" || selectDay?.label === "월 반복") && (
          <div className="animate-in fade-in mb-5 flex flex-col gap-2 text-left duration-300">
            <label className="text-md-sb text-color-primary" htmlFor="repeat">
              반복 요일
            </label>
            <ul className="flex flex-row justify-between">
              {weekDays.map((item) => {
                const isSelected = selectedDays.includes(item);
                return (
                  <li
                    key={item}
                    onClick={() => toggleDay(item)}
                    className={`flex cursor-pointer items-center justify-center rounded-xl border border-solid px-2.75 py-2.75 text-sm transition-all duration-200 select-none ${
                      isSelected
                        ? "bg-brand-primary text-color-inverse border-brand-primary"
                        : "text-color-primary border-[#e2e8f0] hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 할 일 메모 */}
        <div className="mb-10 flex flex-col gap-2 text-left">
          <label className="text-md-sb text-color-primary" htmlFor="todoMemo">
            할 일 메모
          </label>
          <Input
            size="content"
            className="border-none ring-1 ring-[#e2e8f0]"
            placeholder="메모를 입력해주세요."
          />
        </div>
      </div>

      <button
        onClick={() => {
          // 여기서 저장 로직 실행
          onClose();
        }}
        className="bg-brand-primary text-lg-b text-color-inverse hover:bg-interaction-hover h-12 w-full rounded-xl text-center transition-colors active:scale-[0.98]"
      >
        만들기
      </button>
    </div>
  );
}
