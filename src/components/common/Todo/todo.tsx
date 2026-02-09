import React from "react";
import CheckedIcon from "@/assets/checkbox-active.svg";
import UncheckedIcon from "@/assets/checkbox.svg";

/**
 * @interface TodoProps
 * @property {string} content - 할 일의 상세 내용입니다.
 * @property {boolean} isCompleted - 할 일의 완료 여부를 결정합니다.
 * @property {() => void} [onToggle] - 컴포넌트 클릭 시 실행되는 이벤트 핸들러입니다.
 * @property {boolean} [isWeb] - 테스트/디버깅용으로 특정 레이아웃을 강제할 때 사용합니다.
 * 이 프롭이 없으면 화면 너비에 따라 반응형으로 동작합니다.
 */
interface TodoProps {
  content: string;
  isCompleted: boolean;
  onToggle?: () => void;
  isWeb?: boolean;
}

/**
 * Coworkers 프로젝트의 공통 Todo 아이템 컴포넌트입니다.
 */
const Todo = ({ content, isCompleted, onToggle, isWeb }: TodoProps) => {
  // isWeb 프롭이 명시적으로 넘어오면(undefined가 아니면) 해당 모드로 고정합니다.
  // 프롭이 없으면 Tailwind의 md: 접두사를 사용하는 반응형 로직을 사용합니다.
  const isWebForced = isWeb !== undefined;

  const containerStyle = isWebForced
    ? isWeb
      ? "gap-4"
      : "gap-3"
    : "gap-3 md:gap-4";

  const iconSize = isWebForced
    ? isWeb
      ? "h-5 w-5"
      : "h-3 w-3"
    : "h-3 w-3 md:h-5 md:w-5";

  const textSize = isWebForced
    ? isWeb
      ? "text-md-r"
      : "text-xs-r"
    : "text-xs-r md:text-md-r";

  return (
    <div
      onClick={onToggle}
      className={`group flex w-full cursor-pointer items-center transition-all ${containerStyle}`}
    >
      {/* 체크박스 아이콘 영역 */}
      <div className={`flex shrink-0 items-center justify-center ${iconSize}`}>
        {isCompleted ? (
          <CheckedIcon className="h-full w-full" />
        ) : (
          <UncheckedIcon className="h-full w-full" />
        )}
      </div>

      {/* 텍스트 내용 영역 */}
      <span
        className={`transition-all duration-200 select-none ${textSize} ${
          isCompleted
            ? "text-color-disabled line-through opacity-60"
            : "text-color-primary"
        }`}
      >
        {content}
      </span>
    </div>
  );
};

export default Todo;
