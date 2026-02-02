import Close from "@/assets/close.svg";

type ListCreateModalProps = {
  onClose: () => void;
};

export default function ListCreateModal({ onClose }: ListCreateModalProps) {
  return (
    <>
      <div className="-mb-2 flex w-full justify-end pt-2">
        <Close onClick={onClose} className="cursor-pointer" />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg-m text-color-primary">할 일 목록</h2>
          <input
            type="text"
            className="placeholder-color-default mb-6 h-[48px] w-full rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
            placeholder="목록 명을 입력해주세요."
          />
        </div>
        <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[280px] rounded-[12px] text-center">
          만들기
        </button>
      </div>
    </>
  );
}
