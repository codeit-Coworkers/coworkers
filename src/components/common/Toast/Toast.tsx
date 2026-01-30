import React, { useEffect, useState, useCallback } from "react";
import AlertIcon from "@/assets/alert-white.svg";

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
