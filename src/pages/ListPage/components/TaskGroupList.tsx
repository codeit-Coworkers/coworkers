interface Group {
  id: number;
  name: string;
  taskCount: number;
  totalCount: number;
}

interface TaskGroupListProps {
  groups: Group[];
}

export const TaskGroupList = ({ groups }: TaskGroupListProps) => {
  return (
    <div className="bg-background-primary border-border-primary font-pretendard w-70 rounded-xl border p-4 shadow-sm">
      <h2 className="text-xl-b text-color-tertiary mb-4">할 일</h2>
      <div className="flex flex-col gap-1">
        {groups.map((group) => (
          <div
            key={group.id}
            className="hover:bg-background-secondary group flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors"
          >
            <span className="text-lg-m text-color-secondary">{group.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-md-sb text-brand-primary">
                {group.taskCount}/{group.totalCount}
              </span>
              <button className="p-1 opacity-0 group-hover:opacity-100">
                {/* 아이콘은 프로젝트의 방식(img/svg)대로 대체하세요 */}
                <img src="/icons/kebab.svg" alt="more" className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="text-md-sb text-brand-primary border-brand-secondary hover:bg-brand-secondary mt-4 flex w-full items-center justify-center gap-2 rounded-full border py-2.5 transition-colors">
        <img src="/icons/plus.svg" alt="add" className="h-4 w-4" />할 일 추가
      </button>
    </div>
  );
};
