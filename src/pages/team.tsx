import { useParams } from "react-router-dom";

import TaskColumn from "@/features/taskcolumn/TaskColumn";
import TeamMemberSection from "@/features/TeamMemberSectiom/TeamMemberSection";
import TodayProgressSection from "@/features/TodayProgressSection/TodayProgressSection";

export default function Team() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  if (!groupId) {
    return <div>팀이 없는 페이지 보여줌</div>;
  }

  const beforeDivider =
    "before:content-[''] before:block before:absolute before:w-[1120px] before:h-px before:bg-border-primary before:top-[-28px] before:left-0";

  return (
    <>
      <div className="flex min-h-[calc(100vh-59px)] flex-col md:mt-[120px] md:ml-[85px] md:w-[1120px]">
        {/* 오늘의 진행도 */}
        <div>
          <TodayProgressSection groupId={groupId} />
        </div>

        {/* 목록 */}
        <div className="flex gap-[32px] px-[16px] pt-[34px] pb-[54px] md:flex-row md:gap-[24px] md:px-0 md:pt-[64px]">
          <div
            className={`bg-background-secondary relative flex-1 ${beforeDivider}`}
          >
            <TaskColumn groupId={groupId} />
          </div>
          <div className="mt-[70px] hidden md:block">
            <TeamMemberSection groupId={groupId} />
          </div>
        </div>
      </div>
    </>
  );
}
