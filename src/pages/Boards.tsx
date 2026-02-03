import BestPostCarousel from "@/features/boards/components/BestPostCarousel";

// 테스트용 더미 데이터
const MOCK_BEST_POSTS = [
  {
    id: 1,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 999,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 999,
  },
  {
    id: 3,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 999,
  },
  {
    id: 4,
    title: "점심 메뉴 추천 받습니다 🍜",
    content: "오늘 점심 뭐 먹을지 고민이에요. 추천 부탁드려요!",
    author: "김철수",
    date: "2024. 07. 24",
    likeCount: 500,
  },
  {
    id: 5,
    title: "회의실 예약 관련 공지 📢",
    content: "이번 주부터 회의실 예약 시스템이 변경됩니다.",
    author: "관리자",
    date: "2024. 07. 23",
    likeCount: 300,
  },
];

/**
 * 자유게시판 페이지
 */
export default function Boards() {
  const handleMoreClick = () => {
    console.log("더보기 클릭");
  };

  return (
    <div className="bg-background-primary min-h-screen p-6">
      <div className="mx-auto max-w-[1120px]">
        {/* 베스트 게시글 캐러셀 */}
        <BestPostCarousel
          posts={MOCK_BEST_POSTS}
          onMoreClick={handleMoreClick}
        />

        {/* 일반 게시글 목록 영역 (추후 구현) */}
        <div className="border-border-primary bg-background-secondary mt-8 rounded-lg border p-8 text-center">
          <p className="text-color-secondary">
            게시글 목록이 여기에 표시됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
