import React, { useState, useMemo, useEffect } from "react";
import { useGroup } from "@/api/group";
import { useUpdateTaskList, useOrderTaskList } from "@/api/tasklist";
import { useUpdateTask } from "@/api/task";
import { useToastStore } from "@/stores/useToastStore";
import TaskCard from "./components/TaskCard";
import TaskColumnModals from "./components/TaskColumnModals";
import { useTaskColumnModals } from "./components/useTaskColumnModals";
import { Button } from "@/components/common/Button/Button";
import PlusBlue from "@/assets/plus_blue.svg";
import FoldTrue from "@/assets/fold-true.svg";
import FoldFalse from "@/assets/fold-false.svg";
import { Link } from "react-router-dom";
import { TaskListServer } from "@/types/taskList";

// --- UI 개선용 드롭 위치 플레이스홀더 ---
function DragPlaceholder() {
  return (
    // onDragEnter stopPropagation: 플레이스홀더 진입 시 컬럼 핸들러로 버블링 차단
    <div
      className="mt-[12px] lg:mt-[20px]"
      onDragEnter={(e) => e.stopPropagation()}
    >
      <div className="border-brand-primary bg-brand-primary/5 h-[72px] rounded-[12px] border-2 border-dashed" />
    </div>
  );
}
// ----------------------------------------

// 할 일 목록 이름에서 상태를 파싱하는 함수
function parseStatus(name: string): "doing" | "todo" {
  return name.includes("{status:doing}") ? "doing" : "todo";
}

// 서버에서 받은 할 일 목록을 상태별로 분류하는 함수
function splitByStatus(taskLists: TaskListServer[]) {
  const done = taskLists.filter(
    (tasklist) =>
      tasklist.tasks.length > 0 && tasklist.tasks.every((t) => t.doneAt),
  );
  const doing = taskLists.filter(
    (tasklist) =>
      !done.includes(tasklist) && parseStatus(tasklist.name) === "doing",
  );
  const todo = taskLists.filter(
    (tasklist) =>
      !done.includes(tasklist) && parseStatus(tasklist.name) === "todo",
  );
  return { todo, doing, done };
}

interface TaskColumnProps {
  groupId: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function TaskColumn({
  groupId,
  isCollapsed,
  onToggleCollapse,
}: TaskColumnProps) {
  const { data: groupData } = useGroup(groupId);
  const { mutate: updateTaskList } = useUpdateTaskList(groupId);
  const { mutate: updateTaskDone } = useUpdateTask(groupId);
  const { mutateAsync: orderTaskListAsync } = useOrderTaskList(groupId);
  const { show: showToast } = useToastStore();

  const taskLists = useMemo(() => groupData?.taskLists ?? [], [groupData]);

  // 컬럼별 로컬 상태
  const [todoLists, setTodoLists] = useState<TaskListServer[]>([]);
  const [inProgressLists, setInProgressLists] = useState<TaskListServer[]>([]);
  const [doneLists, setDoneLists] = useState<TaskListServer[]>([]);

  // 서버 데이터 변경 시 컬럼 상태 동기화
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const { todo, doing, done } = splitByStatus(taskLists);
    setTodoLists(todo);
    setInProgressLists(doing);
    setDoneLists(done);
  }, [taskLists]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 드래그 상태
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<
    "todo" | "doing" | "done" | null
  >(null);

  // --- UI 개선용 드롭 위치 추적 state ---
  const [dropTargetColumn, setDropTargetColumn] = useState<
    "todo" | "doing" | "done" | null
  >(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number>(0);
  // --------------------------------------

  // 드래그 시작 핸들러
  const handleDragStart = (id: number, from: "todo" | "doing" | "done") => {
    setDraggingId(id);
    setDraggingFrom(from);
  };

  // 드롭 핸들러
  const handleDrop = async (target: "todo" | "doing" | "done") => {
    if (draggingId === null || draggingFrom === null) return;

    const sourceMap = {
      todo: todoLists,
      doing: inProgressLists,
      done: doneLists,
    };

    const setterMap = {
      todo: setTodoLists,
      doing: setInProgressLists,
      done: setDoneLists,
    };

    // 드래그 중인 아이템 찾기
    const item = sourceMap[draggingFrom].find(
      (tasklist) => tasklist.id === draggingId,
    );
    if (!item) return;

    if (target === "done" && item.tasks.length === 0) {
      showToast("완료할 할일이 없습니다.");
      return;
    }

    // --- UI 개선: 삽입 위치의 전역 displayIndex 계산 ---
    // API는 "최종 위치"로 이동하는 방식이라, 이동 방향에 따라 보정 필요
    // - 앞→뒤(forward): 사이 항목들이 좌로 당겨지므로 target이 -1됨 → target.dIdx - 1 전송
    // - 뒤→앞(backward): 사이 항목들이 우로 밀리므로 target 위치 그대로 → target.dIdx 전송
    const targetList = sourceMap[target];
    let targetDisplayIndex: number;

    if (dropTargetIndex < targetList.length) {
      const targetItem = targetList[dropTargetIndex];
      targetDisplayIndex =
        item.displayIndex < targetItem.displayIndex
          ? targetItem.displayIndex - 1 // forward: target이 -1로 당겨지므로 보정
          : targetItem.displayIndex; // backward: target이 +1로 밀림, 현재 위치 전송
    } else if (targetList.length > 0) {
      const lastItem = targetList[targetList.length - 1];
      targetDisplayIndex =
        item.displayIndex < lastItem.displayIndex
          ? lastItem.displayIndex // forward: lastItem이 -1로 당겨짐 → 그 자리로
          : lastItem.displayIndex + 1; // backward: lastItem 다음으로
    } else {
      targetDisplayIndex = 0; // 빈 컬럼
    }
    // ----------------------------------------------------

    // 같은 컬럼 내 재정렬
    if (draggingFrom === target) {
      setterMap[target]((prev) => {
        const originalIndex = prev.findIndex((t) => t.id === draggingId);
        const next = prev.filter((t) => t.id !== draggingId);
        const insertAt =
          dropTargetIndex > originalIndex
            ? dropTargetIndex - 1
            : dropTargetIndex;
        next.splice(insertAt, 0, item);
        return next;
      });

      setDraggingId(null);
      setDraggingFrom(null);
      setDropTargetColumn(null);

      await orderTaskListAsync({
        taskListId: item.id,
        displayIndex: targetDisplayIndex,
      });
      return;
    }

    // 출발 컬럼에서 제거
    setterMap[draggingFrom]((prev) =>
      prev.filter((tasklist) => tasklist.id !== draggingId),
    );

    // 도착 컬럼에 추가 (name 마커 처리)
    const cleanName = item.name.replace("{status:doing}", "").trim();
    const newName =
      target === "doing" ? `${cleanName}{status:doing}` : cleanName;
    // UI 개선: splice로 정확한 index에 삽입 (기존: [...prev, item])
    setterMap[target]((prev) => {
      const next = [...prev];
      next.splice(dropTargetIndex, 0, { ...item, name: newName });
      return next;
    });

    setDraggingId(null);
    setDraggingFrom(null);
    setDropTargetColumn(null); // UI 개선용

    // UI 개선: 순서 변경 API - 완료 후에 status API 호출 (레이스 컨디션 방지)
    await orderTaskListAsync({
      taskListId: item.id,
      displayIndex: targetDisplayIndex,
    });

    if (target === "done") {
      // 완료로 이동: 미완료 task 전부 done 처리
      item.tasks
        .filter((task) => !task.doneAt)
        .forEach((task) => {
          updateTaskDone({ taskListId: item.id, taskId: task.id, done: true });
        });
    } else if (draggingFrom === "done") {
      // 완료에서 나올 때: 전부 done 취소
      item.tasks.forEach((task) => {
        updateTaskDone({ taskListId: item.id, taskId: task.id, done: false });
      });
      updateTaskList({ taskListId: item.id, newName });
    } else {
      // todo <-> doing: name 마커만 변경
      updateTaskList({ taskListId: item.id, newName });
    }
  };

  // --- UI 개선용 핸들러 ---
  // 드래그 완전 종료 (성공/ESC/바깥 릴리즈 모두)
  const handleDragEnd = () => {
    setDraggingId(null);
    setDraggingFrom(null);
    setDropTargetColumn(null);
  };

  // 카드 위에 진입 → 해당 index에 플레이스홀더
  const handleDragEnterCard = (
    column: "todo" | "doing" | "done",
    index: number,
    e: React.DragEvent,
  ) => {
    e.stopPropagation(); // 컬럼 레벨 핸들러 덮어쓰기 방지
    setDropTargetColumn(column);
    setDropTargetIndex(index);
  };

  // 컬럼 빈 공간 진입 → 다른 컬럼으로 새로 들어올 때만 index 리셋
  const handleDragEnterColumn = (
    column: "todo" | "doing" | "done",
    listLength: number,
  ) => {
    setDropTargetColumn((prev) => {
      if (prev !== column) {
        // 새 컬럼 진입 시에만 끝으로 초기화 (같은 컬럼 내 재진입 시 index 유지)
        setDropTargetIndex(listLength);
      }
      return column;
    });
  };
  // -----------------------

  // 접기/펼치기 상태에 따른 클래스
  const foldClass = isCollapsed
    ? { height: "md:h-[calc(100vh-152px)]", colWidth: "md:w-[330px]" }
    : { height: "md:h-[calc(100vh-546px)]", colWidth: "md:w-[270px]" };

  // 모달 관련 상태와 함수
  const { modalType, selectedTaskList, openModal, closeModal } =
    useTaskColumnModals();

  return (
    <div>
      {/* 목록 명 */}
      <div className="flex items-center justify-between">
        <p className="flex gap-1">
          <span className="text-lg-m text-color-primary">할 일 목록</span>
          <span className="text-lg-m text-color-default">
            ({taskLists.length}개)
          </span>
        </p>
        <div className="flex items-center gap-2">
          {onToggleCollapse && (
            <button
              type="button"
              className="hidden h-7 w-7 rotate-[-90deg] cursor-pointer transition-opacity hover:opacity-70 md:block"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? (
                <FoldTrue className="h-full w-full" />
              ) : (
                <FoldFalse className="h-full w-full" />
              )}
            </button>
          )}
          <Button
            size="todoAdd"
            variant="default"
            icon={<PlusBlue className="h-4 w-4" />}
            onClick={() => openModal("ListCreate", null)}
          >
            목록 추가
          </Button>
        </div>
      </div>

      {/* 할 일 칼럼 */}
      <div
        className={`mt-[16px] justify-between md:mt-[30px] md:flex md:gap-[16px] md:overflow-visible md:overflow-y-auto ${foldClass.height}`}
      >
        {/* 할 일 */}
        <div
          className={foldClass.colWidth}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("todo")}
          onDragEnter={() => handleDragEnterColumn("todo", todoLists.length)}
        >
          <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
            <span className="text-color-primary text-md-m">할 일</span>
          </div>
          <div className="relative md:mt-[20px] md:h-[calc(100%-57px)] md:overflow-y-auto md:px-[5px] md:pb-[40px]">
            <div className="relative">
              {todoLists.length === 0 && (
                <p className="flex h-full items-center justify-center py-[20px] md:py-0">
                  할 일 목록이 없습니다.
                </p>
              )}

              {todoLists.map((taskList, index) => (
                <React.Fragment key={taskList.id}>
                  {/* UI 개선: 해당 index 앞에 드롭 플레이스홀더 (같은 컬럼이면 표시 안 함) */}
                  {dropTargetColumn === "todo" &&
                    dropTargetIndex === index &&
                    draggingId !== null && <DragPlaceholder />}
                  <Link
                    to={`tasklists/${taskList.id}`}
                    onDragEnter={(e) => handleDragEnterCard("todo", index, e)}
                  >
                    <TaskCard
                      groupId={groupId}
                      taskList={taskList}
                      badgeState="start"
                      onEdit={() => openModal("ListEdit", taskList)}
                      onDelete={() => openModal("ListDelete", taskList)}
                      onDragStart={() => handleDragStart(taskList.id, "todo")}
                      isDragging={draggingId === taskList.id}
                      onDragEnd={handleDragEnd}
                    />
                  </Link>
                </React.Fragment>
              ))}
              {/* UI 개선: 컬럼 끝(빈 공간)에 드롭할 때 (같은 컬럼이면 표시 안 함) */}
              {dropTargetColumn === "todo" &&
                dropTargetIndex >= todoLists.length &&
                draggingId !== null && <DragPlaceholder />}
            </div>
          </div>
        </div>

        {/* 진행중 */}
        <div
          className={`mt-[16px] md:mt-0 ${foldClass.colWidth}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("doing")}
          onDragEnter={() =>
            handleDragEnterColumn("doing", inProgressLists.length)
          }
        >
          <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
            <span className="text-color-primary text-md-m">진행중</span>
          </div>
          <div className="md:mt-[20px] md:h-[calc(100%-57px)] md:overflow-y-auto md:pb-[40px]">
            <div className="relative md:overflow-y-auto md:px-[5px] md:pb-[40px]">
              {inProgressLists.length === 0 && (
                <p className="flex h-full items-center justify-center py-[20px] md:py-0">
                  진행중인 목록이 없습니다.
                </p>
              )}
              {inProgressLists.map((taskList, index) => (
                <React.Fragment key={taskList.id}>
                  {/* UI 개선: 해당 index 앞에 드롭 플레이스홀더 (같은 컬럼이면 표시 안 함) */}
                  {dropTargetColumn === "doing" &&
                    dropTargetIndex === index &&
                    draggingId !== null && <DragPlaceholder />}
                  <Link
                    to={`tasklists/${taskList.id}`}
                    onDragEnter={(e) => handleDragEnterCard("doing", index, e)}
                  >
                    <TaskCard
                      groupId={groupId}
                      taskList={taskList}
                      badgeState="ongoing"
                      onEdit={() => openModal("ListEdit", taskList)}
                      onDelete={() => openModal("ListDelete", taskList)}
                      onDragStart={() => handleDragStart(taskList.id, "doing")}
                      isDragging={draggingId === taskList.id}
                      onDragEnd={handleDragEnd}
                    />
                  </Link>
                </React.Fragment>
              ))}
              {/* UI 개선: 컬럼 끝(빈 공간)에 드롭할 때 (같은 컬럼이면 표시 안 함) */}
              {dropTargetColumn === "doing" &&
                dropTargetIndex >= inProgressLists.length &&
                draggingId !== null && <DragPlaceholder />}
            </div>
          </div>
        </div>

        {/* 완료 */}
        <div
          className={`mt-[16px] md:mt-0 ${foldClass.colWidth}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop("done")}
          onDragEnter={() => handleDragEnterColumn("done", doneLists.length)}
        >
          <div className="bg-background-tertiary flex items-center justify-between rounded-[12px] py-[10px] pr-[8px] pl-[20px]">
            <span className="text-color-primary text-md-m">완료</span>
          </div>
          <div className="md:mt-[20px] md:h-[calc(100%-57px)] md:overflow-y-auto md:pb-[40px]">
            <div className="relative md:overflow-y-auto md:px-[5px] md:pb-[40px]">
              {doneLists.length === 0 && (
                <p className="flex h-full items-center justify-center py-[20px] md:py-0">
                  완료된 목록이 없습니다.
                </p>
              )}

              {doneLists.map((taskList, index) => (
                <React.Fragment key={taskList.id}>
                  {/* UI 개선: 해당 index 앞에 드롭 플레이스홀더 (같은 컬럼이면 표시 안 함) */}
                  {dropTargetColumn === "done" &&
                    dropTargetIndex === index &&
                    draggingId !== null && <DragPlaceholder />}
                  <Link
                    to={`tasklists/${taskList.id}`}
                    onDragEnter={(e) => handleDragEnterCard("done", index, e)}
                  >
                    <TaskCard
                      groupId={groupId}
                      taskList={taskList}
                      badgeState="done"
                      onEdit={() => openModal("ListEdit", taskList)}
                      onDelete={() => openModal("ListDelete", taskList)}
                      onDragStart={() => handleDragStart(taskList.id, "done")}
                      isDragging={draggingId === taskList.id}
                      onDragEnd={handleDragEnd}
                    />
                  </Link>
                </React.Fragment>
              ))}
              {/* UI 개선: 컬럼 끝(빈 공간)에 드롭할 때 (같은 컬럼이면 표시 안 함) */}
              {dropTargetColumn === "done" &&
                dropTargetIndex >= doneLists.length &&
                draggingId !== null && <DragPlaceholder />}
            </div>
          </div>
        </div>
      </div>
      <TaskColumnModals
        modalType={modalType}
        selectedTaskList={selectedTaskList}
        closeModal={closeModal}
      />
    </div>
  );
}
