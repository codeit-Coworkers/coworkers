# 반복 할일 생성 API 정리

## 엔드포인트

```
POST /{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks
```

## frequencyType별 필수 필드

| frequencyType | 필수 필드 | 예시 |
|---------------|----------|------|
| `DAILY` | - | `{}` |
| `WEEKLY` | `weekDays: number[]` | `{ "weekDays": [1, 3, 5] }` |
| `MONTHLY` | `monthDay: number` | `{ "monthDay": 15 }` |
| `ONCE` | - | `{}` |

## 공통 필수 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 할일 이름 |
| `description` | string | 할일 설명 |
| `startDate` | string (ISO 8601) | 시작 날짜 (예: `"2026-02-02T00:00:00Z"`) |
| `frequencyType` | string | `DAILY` / `WEEKLY` / `MONTHLY` / `ONCE` |

## weekDays 매핑 (WEEKLY용)

| 숫자 | 요일 |
|------|------|
| 0 | 일요일 |
| 1 | 월요일 |
| 2 | 화요일 |
| 3 | 수요일 |
| 4 | 목요일 |
| 5 | 금요일 |
| 6 | 토요일 |

## 예시 요청

### DAILY

```json
{
  "name": "매일 할일",
  "description": "설명",
  "startDate": "2026-02-02T00:00:00Z",
  "frequencyType": "DAILY"
}
```

### WEEKLY (월, 수, 금)

```json
{
  "name": "주간 할일",
  "description": "설명",
  "startDate": "2026-02-02T00:00:00Z",
  "frequencyType": "WEEKLY",
  "weekDays": [1, 3, 5]
}
```

### MONTHLY (매월 15일)

```json
{
  "name": "월간 할일",
  "description": "설명",
  "startDate": "2026-02-02T00:00:00Z",
  "frequencyType": "MONTHLY",
  "monthDay": 15
}
```

### ONCE

```json
{
  "name": "일회성 할일",
  "description": "설명",
  "startDate": "2026-02-02T00:00:00Z",
  "frequencyType": "ONCE"
}
```

---

## 할일 목록 조회

```
GET /{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks?date=2026-02-02
```

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `date` | string | O | 조회할 날짜 (`YYYY-MM-DD`) |

### 주의사항

- `date`는 `startDate` 이후 날짜여야 함
- 해당 날짜에 반복 조건이 맞아야 task가 반환됨
  - DAILY: 매일
  - WEEKLY: 해당 요일
  - MONTHLY: 해당 일자
  - ONCE: startDate 당일만
