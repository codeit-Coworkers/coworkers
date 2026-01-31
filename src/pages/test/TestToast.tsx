import React, { useState } from "react";
import Toast from "@/components/common/Toast/toast";

const ToastTestPage = () => {
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleOpenToast = () => {
    setShowToast(true);
  };

  const handleSave = () => {
    alert("변경사항이 성공적으로 저장되었습니다!");
    setShowToast(false);
  };

  const handleClose = () => {
    setShowToast(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Toast Component Test
        </h1>
        <p className="mb-8 text-gray-600">
          아래 버튼을 누르면 'Coworkers' 프로젝트용 공통 토스트가 나타납니다.
          <br />
        </p>

        <button
          onClick={handleOpenToast}
          className="w-full rounded-lg bg-[#718AFF] px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-[#5a74e6] active:scale-95"
        >
          토스트 띄우기
        </button>
      </div>

      {/* 가이드 문구 */}
      <div className="mt-10 text-center text-sm text-gray-400">
        <p>💡 개발자 도구(F12)를 켜서 모바일 뷰로 전환해보세요!</p>
        <p>화면 너비에 따라 토스트 크기가 유동적으로 변합니다.</p>
      </div>

      {/* 토스트 컨테이너: 하단 중앙 고정 */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 z-9999 flex w-full -translate-x-1/2 justify-center px-5">
          <Toast
            message="저장하지 않은 변경사항이 있어요!"
            onSave={handleSave}
            onClose={handleClose}
            duration={5000}
          />
        </div>
      )}
    </div>
  );
};

export default ToastTestPage;
