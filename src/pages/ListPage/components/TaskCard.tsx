import React, { useState, useRef, useEffect } from "react";
import KebabIcon from "@/assets/kebab.svg"; // 프로젝트 경로 확인 필요
import CheckIcon from "@/assets/check.svg";
import CommentIcon from "@/assets/comment.svg";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";

interface TaskCardProps {
  title: string;
  commentCount: number;
  date: Date;
  isRecurring: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({
  title,
  commentCount,
  date,
  isRecurring,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group border-border-primary hover:border-brand-primary relative flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all">
      <div className="flex flex-1 items-start gap-4">
        {/* 체크박스 */}
        <button
          onClick={onToggle}
          className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
            isCompleted
              ? "bg-brand-primary border-brand-primary"
              : "border-border-primary"
          }`}
        >
          {isCompleted && <CheckIcon className="h-4 w-4 text-white" />}
        </button>

        <div className="space-y-2">
          {/* 제목 */}
          <h4
            className={`text-lg-m ${isCompleted ? "text-color-disabled line-through" : "text-color-primary"}`}
          >
            {title}
          </h4>

          {/* 푸터 정보 (댓글, 날짜, 반복 여부) */}
          <div className="text-xs-m text-color-tertiary flex items-center gap-4">
            <div className="flex items-center gap-1">
              <CommentIcon className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{date.toLocaleDateString()}</span>
            </div>
            {isRecurring && (
              <div className="flex items-center gap-1">
                <RepeatIcon className="h-4 w-4" />
                <span>매일 반복</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 케밥 버튼 및 드롭다운 메뉴 */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="hover:bg-background-secondary rounded-md p-1 transition-colors"
        >
          <KebabIcon className="text-icon-primary h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="border-border-primary absolute right-0 z-50 mt-2 w-24 overflow-hidden rounded-lg border bg-white shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
                setIsMenuOpen(false);
              }}
              className="text-color-primary hover:bg-background-secondary w-full px-4 py-2 text-left text-sm font-medium"
            >
              수정하기
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
