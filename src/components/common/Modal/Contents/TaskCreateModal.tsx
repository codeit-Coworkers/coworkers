import { useRef, useState } from "react";
import Dropdown, { Option } from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

/**
 * 요일 표시용 상수 배열
 * - 반복 요일 선택 UI에서 사용됩니다.
 */
const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 할 일 생성 모달 콘텐츠 컴포넌트
 *
 * ## 역할
 * - 할 일(Task)을 생성하기 위한 입력 폼 UI를 제공합니다.
 * - 시작 날짜/시간 선택(Calendar)과 반복 설정(Dropdown)을 포함합니다.
 *
 * ## 주요 기능
 * - 제목/메모 입력 (Input 컴포넌트 사용)
 * - 시작 날짜 선택 (`CalendarDate`)
 * - 시작 시간 선택 (`CalendarTime`)
 * - 반복 설정 선택 (`Dropdown` - optionsKey="repeat")
 * - 반복 설정이 "주 반복" 또는 "월 반복"인 경우 요일 선택 UI 표시
 *
 * ## 동작 방식
 * - 날짜 입력 클릭 시 날짜 캘린더 레이어가 열립니다.
 * - 시간 입력 클릭 시 시간 선택 레이어가 열리고, 날짜 레이어는 닫힙니다.
 * - 캘린더 레이어 바깥을 클릭하면 `useClickOutside`로 레이어가 닫힙니다.
 * - 반복 설정 dropdown 선택값에 따라 반복 요일 UI가 조건부로 렌더링됩니다.
 */
export default function TaskCreateModal() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const dateLayerRef = useRef<HTMLDivElement>(null);
  const timeLayerRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateLayerRef, () => setIsDateOpen(false));
  useClickOutside(timeLayerRef, () => setIsTimeOpen(false));

  const [selectDay, setSelectDay] = useState<Option | null>(null);

  const formattedDate = date ? getDateTime(date).dateString : "";

  const { dateString, timeString } = getDateTime();

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  return (
    <div className="p-5">
      <div className="mt-2 mb-4 flex flex-col">
        <h2 className="text-lg-m text-color-primary mb-5">할 일 만들기</h2>
        <p className="text-md-r text-color-default mb-10">
          할 일은 실제로 행동 가능한 작업 중심으로
          <br /> 작성해주시면 좋습니다.
        </p>
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label htmlFor="todoTitle">할 일 제목</label>
          <Input
            size="search"
            className="border-none ring-1 ring-[#e2e8f0]"
            placeholder="할 일 제목을 입력해주세요."
          />
        </div>
        <div className="mb-5 flex flex-col text-left">
          <label htmlFor="startAt" className="mb-2">
            시작 날짜 및 시간
          </label>
          <div className="flex flex-row gap-2">
            <input
              id="startAtDate"
              type="text"
              value={formattedDate}
              readOnly
              onClick={() => setIsDateOpen((item) => !item)}
              className="placeholder-color-default text-color-default h-[48px] w-3/5 cursor-pointer rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4 caret-transparent"
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
              className="placeholder-color-default text-color-default h-[48px] w-2/5 cursor-pointer rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4 caret-transparent"
              placeholder={timeString}
            />
          </div>
          <div>
            {isDateOpen && (
              <div className="mt-2 flex justify-center" ref={dateLayerRef}>
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
              <div className="mt-2 flex justify-center" ref={timeLayerRef}>
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
        <div className="mb-5 flex flex-col gap-2 text-left">
          <label htmlFor="repeat">반복 설정</label>
          <div className="w-[130px]">
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
        {selectDay?.label === "주 반복" || selectDay?.label === "월 반복" ? (
          <div className="mb-5 flex flex-col gap-2 text-left">
            <label htmlFor="repeat">반복 요일</label>
            <div>
              <ul className="flex flex-row justify-between">
                {weekDays.map((item) => (
                  <li
                    key={item}
                    onClick={() => toggleDay(item)}
                    className={
                      selectedDays.includes(item)
                        ? "bg-brand-primary text-color-inverse hover:bg-brand-primary hover:text-background-primary flex cursor-pointer items-center justify-center rounded-[12px] border-1 border-solid border-[#e2e8f0] px-[11px] py-[11px]"
                        : "hover:bg-brand-primary hover:text-background-primary flex cursor-pointer items-center justify-center rounded-[12px] border-1 border-solid border-[#e2e8f0] px-[11px] py-[11px]"
                    }
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="mb-5 flex flex-col gap-2 text-left">
          <label htmlFor="todoMemo">할 일 메모</label>
          <Input
            size="content"
            className="border-none ring-1 ring-[#e2e8f0]"
            placeholder="메모를 입력해주세요."
          />
        </div>
      </div>

      <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-full rounded-[12px] text-center">
        만들기
      </button>
    </div>
  );
}
