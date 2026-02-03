import BestPostCarousel from "@/features/boards/components/BestPostCarousel";
import { Input } from "@/components/common/Input/Input";
import { useIsMobile } from "@/hooks/useMediaQuery";

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
  const isMobile = useIsMobile(); // < 768px

  const handleMoreClick = () => {
    console.log("더보기 클릭");
  };

  // 마진 클래스: 데스크톱 87/30, 태블릿 77/29, 모바일 25/20
  const headerMarginClass = isMobile
    ? "mt-[25px] mb-[20px]"
    : "mt-[77px] mb-[29px] lg:mt-[87px] lg:mb-[30px]";

  // 제목 크기: 데스크톱/태블릿 24px, 모바일 20px
  const titleClass = isMobile ? "text-xl-b" : "text-2xl-b";

  return (
    <div className="!bg-background-primary min-h-screen">
      <div className="mx-auto max-w-[1120px] px-4 md:px-6">
        {/* 헤더: 자유게시판 + 검색창 */}
        <header
          className={`${headerMarginClass} ${
            isMobile
              ? "flex flex-col gap-5"
              : "flex items-center justify-between"
          }`}
        >
          <h1 className={`${titleClass} text-color-primary`}>자유게시판</h1>

          {/* 검색창 */}
          <div className={isMobile ? "w-full" : "w-[420px]"}>
            <Input
              variant="search"
              withSearchIcon
              placeholder="검색어를 입력해주세요"
              className={`!rounded-[1000px] !border-2 ${
                isMobile ? "!h-[48px]" : "!h-[56px]"
              }`}
            />
          </div>
        </header>

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
