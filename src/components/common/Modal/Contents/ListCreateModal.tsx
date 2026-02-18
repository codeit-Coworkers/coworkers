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
      <div className="-mb-2 flex w-full justify-end pt-2">
        <Close onClick={onClose} className="cursor-pointer" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg-m text-color-primary">할 일 목록</h2>

          <input
            type="text"
            className="placeholder-color-default border-border-primary mb-6 h-12 w-full rounded-xl border border-solid p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="목록 명을 입력해주세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate(); // 엔터 키 지원
            }}
          />
        </div>

        {/* 버튼 영역 */}
        <button
          className="bg-brand-primary text-lg-b text-color-inverse h-12 w-full rounded-xl text-center"
          onClick={handleCreate} // 핸들러 연결
        >
          만들기
        </button>
      </div>
    </div>
  );
}
