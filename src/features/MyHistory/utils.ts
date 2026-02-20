// description에서 taskListId 추출하는 유틸 함수
export function parseTaskListId(description: string): number | null {
  try {
    const parsed = JSON.parse(description);
    if (parsed.taskListId != null) return Number(parsed.taskListId);
  } catch {
    // JSON 아닌 경우 정규식으로 추출
  }

  // taskListId: 5310 또는 "taskListId": 5310 패턴 매칭
  const match = description.match(/taskListId["\s]*:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}
