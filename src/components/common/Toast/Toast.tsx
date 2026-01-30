import React, { useEffect, useState, useCallback } from "react";
import AlertIcon from "@/assets/alert-white.svg";

/**
 * Coworkers 프로젝트의 공통 알림(Toast) 컴포넌트입니다.
 * * @description
 * - 화면 하단에 고정되어 사용자에게 변경사항 알림 및 저장 액션을 제공합니다.
 * - Desktop(max-w: 868px)과 Mobile(w: 100% - 32px)에 최적화된 Responsive UI를 지원합니다.
 * - 웹/태블릿 환경에서는 아이콘이 노출되며, 모바일 환경(sm 미만)에서는 텍스트 공간 확보를 위해 아이콘이 숨겨집니다.
 * * @component
 * @param {Object} props - Toast 컴포넌트의 Props
 * @param {string} props.message - 토스트에 표시될 메시지 (예: "저장하지 않은 변경사항이 있어요!")
 * @param {() => void} props.onSave - '변경사항 저장하기' 버튼 클릭 시 실행될 핸들러 함수
 * @param {() => void} props.onClose - 토스트가 닫힐 때(자동 소멸 포함) 부모 상태를 제어하기 위한 콜백 함수
 * @param {number} [props.duration=5000] - 토스트가 화면에 유지되는 시간 (ms 단위, 기본값 5초)
 * * @example
 * <Toast
 * message="저장하지 않은 변경사항이 있어요!"
 * onSave={handleSave}
 * onClose={() => setShowToast(false)}
 * />
 */

interface ToastProps {
  message: string;
  onSave: () => void;
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, onSave, onClose, duration = 5000 }: ToastProps) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <div
      className={`text-color-inverse flex items-center justify-between bg-[#718AFF] shadow-lg transition-all duration-300 ease-in-out ${isExiting ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"} w-[calc(100vw-32px)] max-w-217 rounded-2xl px-3 py-3 sm:w-full sm:px-6 sm:py-4`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <div className="hidden shrink-0 sm:block">
          <AlertIcon width="24" height="24" className="text-color-inverse" />
        </div>

        <span className="text-sm-sb sm:text-lg-sb font-semibold whitespace-nowrap">
          {message}
        </span>
      </div>

      {/* 오른쪽: 액션 버튼 */}
      <button
        onClick={onSave}
        className="bg-color-inverse text-brand-primary hover:bg-opacity-90 text-xs-sb sm:text-md-sb ml-2 h-9 w-auto max-w-35.25 min-w-25 shrink-0 rounded-lg px-2 text-center font-semibold transition-colors sm:h-10 sm:min-w-31.25 sm:px-4"
      >
        변경사항 저장하기
      </button>
    </div>
  );
};

export default Toast;
