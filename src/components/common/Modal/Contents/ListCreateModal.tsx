import { useCreateTaskList } from "@/api/tasklist";
import Close from "@/assets/close.svg";
import { useToastStore } from "@/stores/useToastStore";
import { useState } from "react";

// Props 타입 정의
type ListCreateModalProps = {
  onClose: () => void;
  groupId: number;
};

export default function ListCreateModal({
  onClose,
  groupId,
}: ListCreateModalProps) {
  // 1. API 뮤테이션 및 상태 관리
  const { mutate: createList } = useCreateTaskList(groupId);
  const [name, setName] = useState("");
  const { show: showToast } = useToastStore();

  // 2. 만들기 버튼 클릭 핸들러
  const handleCreate = () => {
    if (!name.trim()) {
      showToast("목록 이름을 입력해주세요.");
      return;
    }

    createList(name, {
      onSuccess: () => {
        showToast("목록이 생성되었습니다.");
        onClose();
      },
      onError: () => {
        showToast("목록 생성에 실패했습니다.");
      },
    });
  };

  return (
    <div className="bg-background-primary border-border-primary font-pretendard relative w-full rounded-3xl border p-6 shadow-xl md:w-[384px]">
      {/* 상단 닫기 버튼 영역 */}
      <div className="flex w-full justify-end">
        <Close
          onClick={onClose}
          className="text-icon-primary hover:text-color-primary cursor-pointer transition-colors"
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="mt-2 flex flex-col gap-4">
        <h2 className="text-xl-b text-color-primary text-center">할 일 목록</h2>

        <input
          type="text"
          className="text-md-r placeholder:text-color-disabled border-border-primary bg-background-secondary focus:border-brand-primary h-12 w-full rounded-xl border p-4 transition-all outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="목록 명을 입력해주세요."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate(); // 엔터 키 지원
          }}
        />

        {/* 버튼 영역 */}
        <button
          className="bg-brand-primary text-lg-b text-color-inverse hover:bg-interaction-hover active:bg-interaction-pressed mt-2 h-12 w-full rounded-xl text-center transition-colors"
          onClick={handleCreate} // 핸들러 연결
        >
          만들기
        </button>
      </div>
    </div>
  );
}
