import { useState } from "react";
import { useParams } from "react-router-dom";

import Dropdown from "@/components/common/Dropdown/Dropdown";
import {
  useCreateTaskComment,
  useDeleteTaskComment,
  useGetTask,
  useGetTaskComment,
  useGetUser,
  useUpdateTaskComment,
  useUpdateTaskListDone,
} from "@/api/tasklistDetail";
import getDateTime from "@/utils/dateTime";

import CloseIcon from "@/assets/close.svg";
import UserIcon from "@/assets/user.svg";
import DateIcon from "@/assets/calendar.svg";
import RepeatIcon from "@/assets/repeat.svg";
import CheckBlue from "@/assets/check.svg";
import CheckWhite from "@/assets/check-white.svg";
import Enter from "@/features/boards/assets/enter.svg";

const daysAgo = (createdAt: string) => {
  const created = new Date(createdAt).getTime();
  const diffMs = Date.now() - created;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export default function TaskListDetail() {
  const { groupId, taskListId, taskId } = useParams();

  const { data: user } = useGetUser();

  const { data: taskData } = useGetTask(
    Number(groupId),
    Number(taskListId),
    Number(taskId),
  );

  const isDone = !!taskData?.doneAt;

  const { mutate: setDone } = useUpdateTaskListDone(
    Number(groupId),
    Number(taskListId),
    Number(taskId),
  );

  const handleDone = () => setDone(true);
  const handleUndoDone = () => setDone(false);

  const { data: commentData } = useGetTaskComment(Number(taskId));

  const startDate = taskData?.recurring?.startDate;
  const startDateText = startDate
    ? (() => {
        const { dateString, timeString } = getDateTime(new Date(startDate));
        return `${dateString} ${timeString}`;
      })()
    : "-";

  const freqLabel = (type?: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY") => {
    switch (type) {
      case "ONCE":
        return "한 번";
      case "DAILY":
        return "매일";
      case "WEEKLY":
        return "주 반복";
      case "MONTHLY":
        return "월 반복";
    }
  };

  const [comment, setComment] = useState("");
  const { mutate: createComment, isPending } = useCreateTaskComment(
    Number(taskId),
  );

  const handleCreateComment = () => {
    if (!comment.trim()) return;
    createComment(comment, {
      onSuccess: () => setComment(""),
    });
  };

  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");

  const startEdit = (commentId: number, currentComment: string) => {
    setEditCommentId(commentId);
    setEditComment(currentComment);
  };

  const cancelEditComment = () => {
    setEditCommentId(null);
    setEditComment("");
  };

  const { mutate: updateComment } = useUpdateTaskComment(Number(taskId));

  const saveEdit = (id: number) => {
    if (!editComment.trim()) return;
    updateComment({ commentId: id, content: editComment });
    setEditCommentId(null);
    setEditComment("");
  };

  const { mutate: deleteComment } = useDeleteTaskComment(Number(taskId));

  return (
    <>
      <div className="bg-background-primary flex flex-col gap-4 px-4 pt-3 pb-4 md:px-7 md:pt-11 lg:px-10">
        <CloseIcon className="cursor-pointer" />
        <div className="mt-4 flex flex-row justify-between md:mt-12">
          {isDone ? (
            <div className="flex h-[24px] flex-row items-center gap-2 md:h-[28px]">
              <div className="text-xl-b md:text-2xl-b text-color-default line-through">
                {taskData?.name}
              </div>
              <div className="text-md-b text-brand-primary bg-brand-secondary flex h-[29px] w-[45px] items-center justify-center rounded-[8px]">
                완료
              </div>
            </div>
          ) : (
            <div className="text-xl-b md:text-2xl-b text-color-primary">
              {taskData?.name}
            </div>
          )}
          <Dropdown trigger="kebab" optionsKey="edit" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-3">
            {user?.image ? (
              <img
                src={user?.image}
                alt="프로필이미지"
                className="h-[32px] w-[32px] rounded-[8px]"
              />
            ) : (
              <UserIcon />
            )}
            <p className="text-md-m">{user?.nickname ?? "-"}</p>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row">
                <div className="flex flex-row gap-1">
                  <DateIcon className="h-4 w-4" />
                  <p className="text-xs-r text-color-default w-[60px]">
                    시작 날짜
                  </p>
                </div>
                <p className="text-xs-r text-color-primary">{startDateText}</p>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-row gap-1">
                  <RepeatIcon className="h-4 w-4" />
                  <p className="text-xs-r text-color-default w-[60px]">
                    반복 설정
                  </p>
                </div>
                <p className="text-xs-r text-color-primary">
                  {freqLabel(taskData?.recurring?.frequencyType)}
                </p>
              </div>
            </div>
            {isDone ? (
              <button
                onClick={handleUndoDone}
                className="border-brand-primary text-brand-primary text-md-sb absolute right-5 bottom-7 flex h-[40px] items-center justify-center gap-1 rounded-[40px] border-1 px-4 md:relative md:right-0 md:bottom-0"
              >
                <CheckBlue />
                완료 취소하기
              </button>
            ) : (
              <button
                onClick={handleDone}
                className="bg-brand-primary text-color-inverse text-md-sb absolute right-5 bottom-7 flex h-[40px] items-center justify-center gap-1 rounded-[40px] px-4 md:relative md:right-0 md:bottom-0"
              >
                <CheckWhite />
                완료 하기
              </button>
            )}
          </div>
          <hr className="h-[1px] border-0 bg-[#E2E8F0]" />
          <div>
            <p className="text-md-r text-color-primary">
              {taskData?.description}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          <p className="text-lg-b md:text-2lg-b text-color-primary flex gap-1">
            댓글
            <span className="text-brand-primary">{taskData?.commentCount}</span>
          </p>
          <div className="flex flex-row items-center gap-[10px]">
            {user?.image ? (
              <img
                src={user?.image}
                alt="프로필이미지"
                className="h-[38px] w-[38px] rounded-[8px]"
              />
            ) : (
              <UserIcon />
            )}
            <div className="relative flex h-12 w-full justify-center border-t-1 border-b-1 border-[#E2E8F0]">
              <input
                type="text"
                placeholder="댓글을 달아주세요"
                className="text-md-r w-full px-3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleCreateComment} disabled={isPending}>
                <Enter className="absolute top-[calc(50%-12px)] right-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background-primary pb-10">
        {commentData?.map((item) => {
          const isEditing = editCommentId === item.id;

          return (
            <div
              key={item.id}
              className={
                isEditing
                  ? "flex flex-row gap-4 bg-[#F8FAFC] px-4 py-3 md:px-7 lg:px-10"
                  : "mx-2 flex flex-row gap-4 border-b-1 border-[#E2E8F0] px-2 py-3 last:border-b-0 md:mx-7 md:px-0 lg:mx-10"
              }
            >
              {item.user.image ? (
                <img
                  src={item.user.image}
                  alt="프로필이미지"
                  className="h-[38px] w-[38px] rounded-[8px]"
                />
              ) : (
                <UserIcon />
              )}
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-row justify-between">
                  <p className="text-color-primary text-md-b">
                    {item.user.nickname}
                  </p>
                  {!isEditing && (
                    <Dropdown
                      trigger="kebab"
                      optionsKey="edit"
                      onSelect={(option) => {
                        if (option.value === "수정하기") {
                          startEdit(item.id, item.content);
                        }
                        if (option.value === "삭제하기") {
                          deleteComment(item.id);
                        }
                      }}
                    />
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="text-color-primary text-md-r"
                  />
                ) : (
                  <>
                    <p className="text-color-primary text-md-r">
                      {item.content}
                    </p>
                    <p className="text-md-r text-color-disabled">
                      {`${daysAgo(item.createdAt)}일 전`}
                    </p>
                  </>
                )}

                {isEditing && (
                  <div className="flex flex-row justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEditComment}
                      className="text-color-default text-md-sb flex h-[33px] w-[53px] items-center justify-center"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="text-brand-primary text-md-r border-brand-primary flex h-[33px] w-[73px] items-center justify-center rounded-[8px] border-1"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
