import React from "react";
import CheckedIcon from "@/assets/checkbox-active.svg";
import UncheckedIcon from "@/assets/checkbox.svg";

interface TodoProps {
  content: string;
  isCompleted: boolean;
  onToggle?: () => void;
  isWeb?: boolean;
}

const Todo = ({ content, isCompleted, onToggle, isWeb = false }: TodoProps) => {
  return (
    <div
      onClick={onToggle}
      className={`group flex w-full cursor-pointer items-center transition-all ${isWeb ? "gap-4 py-3" : "gap-3 py-2"} `}
    >
      {/* 1. 타입에 따른 아이콘 크기 분기 */}
      <div
        className={`flex shrink-0 items-center justify-center ${isWeb ? "h-5 w-5" : "h-3 w-3"} `}
      >
        {isCompleted ? (
          <CheckedIcon className="h-full w-full" />
        ) : (
          <UncheckedIcon className="h-full w-full" />
        )}
      </div>

      {/* 2. 타입에 따른 텍스트 크기 및 완료 스타일 분기 */}
      <span
        className={`transition-all duration-200 select-none ${isWeb ? "text-md-r" : "text-xs-r"} ${
          isCompleted
            ? "text-color-disabled line-through opacity-60"
            : "text-color-primary"
        } `}
      >
        {content}
      </span>
    </div>
  );
};

export default Todo;
