import Dropdown from "@/components/common/Dropdown/Dropdown";

export default function TestDropdown() {
  return (
    <div className="mt-5 flex flex-col gap-20">
      {/* 정렬 옵션 드롭다운 테스트 */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="newest" defaultLabel="최신순" />
      </div>

      {/* 반복 주기 드롭다운 테스트 */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="repeat" defaultLabel="한 번" />
      </div>

      {/* 마이 히스토리 드롭다운 (중앙 정렬) */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="myHistory" listAlign="center" trigger="user" />
      </div>

      {/* 삭제/수정하기 드롭다운 (중앙 정렬) */}
      <div className="border-background-tertiary m-auto flex h-[100px] w-[200px] items-center justify-center rounded-[12px] border-1">
        <Dropdown optionsKey="edit" listAlign="center" trigger="kebab" />
      </div>
    </div>
  );
}
