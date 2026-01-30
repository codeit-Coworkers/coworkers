import React from "react";
import CheckedIcon from "@/assets/checkbox-active.svg";
import UncheckedIcon from "@/assets/checkbox.svg";

/**
 * @interface TodoProps
 * @property {string} content - 할 일의 상세 내용입니다.
 * @property {boolean} isCompleted - 할 일의 완료 여부를 결정합니다. true일 경우 취소선과 opacity-60 스타일이 적용됩니다.
 * @property {() => void} [onToggle] - 컴포넌트 클릭 시 실행되는 이벤트 핸들러입니다.
 * @property {boolean} [isWeb=false] - 웹 버전 레이아웃 적용 여부입니다. true일 경우 간격과 아이콘 크기가 확장됩니다.
 */

/**
 * Coworkers 프로젝트의 공통 Todo 아이템 컴포넌트입니다.
 * * @component
 * @example
 * ```tsx
 * <Todo
 * content="법인 설립 안내 드리기"
 * isCompleted={false}
 * onToggle={() => console.log('clicked')}
 * isWeb={true}
 * />
 * ```
 * * @param {TodoProps} props - Todo 컴포넌트의 속성
 * @returns {JSX.Element} 모바일/웹 대응이 가능한 Todo 아이템 컴포넌트
 */

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
