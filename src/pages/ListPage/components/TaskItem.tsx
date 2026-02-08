import Todo from "@/components/common/Todo/todo";
import KebabIcon from "@/assets/kebab.svg";
import MessageIcon from "@/assets/message.svg";
import CalendarIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";

interface TaskItemProps {
  title: string;
  commentCount: number;
  date: Date; // 이제 문자열 대신 Date 객체를 받는 것이 유지보수에 좋습니다
  isRecurring: boolean;
  isCompleted: boolean;
  onToggle: () => void;
}

export const TaskItem = ({
  title,
  commentCount,
  date,
  isRecurring,
  isCompleted,
  onToggle,
}: TaskItemProps) => {
  // 날짜 포맷팅: "2024년 7월 29일" 형식
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <div className="group bg-background-primary border-border-primary font-pretendard flex items-center justify-between rounded-2xl border p-4 transition-all hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <Todo content={title} isCompleted={isCompleted} onToggle={onToggle} />

        <div
          className={`-mt-0.5 ml-8 flex items-center gap-3 md:ml-9 ${isCompleted ? "opacity-40" : ""}`}
        >
          {commentCount > 0 && (
            <div className="flex shrink-0 items-center gap-1">
              <MessageIcon className="text-icon-primary h-3.5 w-3.5" />
              <span className="text-xs-sb text-color-disabled">
                {commentCount}
              </span>
            </div>
          )}
          <div className="text-color-disabled flex shrink-0 items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span className="text-xs-r">{formattedDate}</span>
          </div>
          {isRecurring && (
            <div className="text-brand-primary flex shrink-0 items-center gap-1">
              <RepeatIcon className="h-3 w-3" />
              <span className="text-xs-m font-semibold">매일 반복</span>
            </div>
          )}
        </div>
      </div>

      <button className="hover:bg-background-secondary shrink-0 rounded-lg p-2 transition-colors">
        <KebabIcon className="text-icon-primary h-5 w-5 opacity-40 group-hover:opacity-100" />
      </button>
    </div>
  );
};
