import { useRef, useState } from "react";
import Dropdown, { Option } from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import CalendarDate from "../../Calendar/CalendarDate";
import CalendarTime from "../../Calendar/CalendarTime";
import getDateTime from "@/utils/dateTime";
import { useClickOutside } from "@/hooks/useClickOutside";

const weekDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

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

  const formattedDate = date
    ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    : "";

  const { dateString, timeString } = getDateTime();

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
            placeholder="할 일 제목를 입력해주세요."
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
                    className="text-color-default hover:bg-brand-primary hover:text-background-primary flex cursor-pointer items-center justify-center rounded-[12px] border-1 border-solid border-[#e2e8f0] px-[11px] py-[11px]"
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
