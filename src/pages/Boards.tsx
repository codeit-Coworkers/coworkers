import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import BestPostCarousel from "@/features/boards/components/BestPostCarousel";
import PostCard from "@/features/boards/components/PostCard";
import { Input } from "@/components/common/Input/Input";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { useIsMobile } from "@/hooks/useMediaQuery";
import PlusIcon from "@/assets/plus.svg";

// 정렬 타입
type SortType = "최신순" | "좋아요 많은순";

// 테스트용 더미 데이터
const MOCK_BEST_POSTS = [
  {
    id: 1,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 1000,
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
    likeCount: 1000,
  },
  {
    id: 3,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 1000,
  },
  {
    id: 4,
    title: "점심 메뉴 추천 받습니다 🍜",
    content: "오늘 점심 뭐 먹을지 고민이에요. 추천 부탁드려요!",
    author: "김철수",
    date: "2024. 07. 24",
    likeCount: 706,
  },
  {
    id: 5,
    title: "회의실 예약 관련 공지 📢",
    content: "이번 주부터 회의실 예약 시스템이 변경됩니다.",
    author: "관리자",
    date: "2024. 07. 23",
    likeCount: 112,
  },
];

// 일반 게시글 더미 데이터
const MOCK_POSTS = [
  {
    id: 101,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 99,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  },
  {
    id: 102,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 850,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  },
  {
    id: 103,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 25",
    likeCount: 720,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  },
  {
    id: 104,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 24",
    likeCount: 650,
  },
  {
    id: 105,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 24",
    likeCount: 500,
  },
  {
    id: 106,
    title: "커피 머신 고장 신고합니다 ☕🚨",
    content:
      "오늘 아침 출근과 동시에 알게 된 사실... 1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
    author: "우지은",
    date: "2024. 07. 23",
    likeCount: 300,
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  },
  {
    id: 107,
    title: "점심 메뉴 추천 부탁드립니다 🍜",
    content: "오늘 점심 뭐 먹을지 고민이에요. 회사 근처 맛집 추천해주세요!",
    author: "김철수",
    date: "2024. 07. 23",
    likeCount: 150,
  },
  {
    id: 108,
    title: "새로운 프로젝트 팀원 모집합니다 🙋",
    content:
      "다음 분기 신규 프로젝트를 위한 팀원을 모집합니다. 관심 있으신 분들은 연락주세요.",
    author: "박영희",
    date: "2024. 07. 22",
    likeCount: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop",
  },
];

/**
 * 자유게시판 페이지
 */
export default function Boards() {
  const isMobile = useIsMobile(); // < 768px
  const isTabletOrSmaller = useIsMobile("lg"); // < 1024px
  const isTablet = !isMobile && isTabletOrSmaller;

  // 정렬 상태
  const [sortType, setSortType] = useState<SortType>("최신순");

  // 정렬된 게시글 목록
  const sortedPosts = useMemo(() => {
    const posts = [...MOCK_POSTS];
    if (sortType === "좋아요 많은순") {
      return posts.sort((a, b) => b.likeCount - a.likeCount);
    }
    // 최신순 (날짜 기준)
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [sortType]);

  const handleMoreClick = () => {
    console.log("더보기 클릭");
  };

  // 정렬 변경 핸들러
  const handleSortChange = (item: { label: string; value: string }) => {
    setSortType(item.value as SortType);
  };

  // 마진 클래스: 데스크톱 87/30, 태블릿 77/29, 모바일 25/20
  const headerMarginClass = isMobile
    ? "mt-[25px] mb-[20px]"
    : "mt-[77px] mb-[29px] lg:mt-[87px] lg:mb-[30px]";

  // 제목 크기: 데스크톱/태블릿 24px, 모바일 20px
  const titleClass = isMobile ? "text-xl-b" : "text-2xl-b";

  // 전체 섹션과 캐러셀 사이 간격: 데스크톱 45px, 나머지 28px
  const sectionGapClass = isTablet ? "mt-[28px]" : "mt-[45px]";

  // 카드 크기: 데스크톱/태블릿은 large, 모바일은 small
  const cardSize = isMobile ? "small" : "large";

  // 그리드 레이아웃: 데스크톱 2열, 태블릿/모바일 1열
  const gridClass =
    isMobile || isTablet
      ? "flex flex-col gap-4"
      : "grid grid-cols-2 gap-x-4 gap-y-5";

  return (
    <div className="!bg-background-primary min-h-screen pb-20">
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

        {/* 전체 게시글 섹션 */}
        <section className={sectionGapClass}>
          {/* 헤더: 전체 + 글쓰기 버튼(모바일/태블릿) + 드롭다운 */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl-b text-color-primary">전체</h2>
            <div className="flex items-center gap-3">
              {/* 글쓰기 버튼 (모바일/태블릿만) */}
              {(isMobile || isTablet) && (
                <Link
                  to="/boards/write"
                  className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  글쓰기
                </Link>
              )}
              <Dropdown
                optionsKey="newest"
                defaultLabel="최신순"
                onSelect={handleSortChange}
              />
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className={gridClass}>
            {sortedPosts.map((post) => (
              <Link key={post.id} to={`/boards/${post.id}`}>
                <PostCard
                  state="default"
                  size={cardSize}
                  title={post.title}
                  content={post.content}
                  author={post.author}
                  date={post.date}
                  likeCount={post.likeCount}
                  imageUrl={post.imageUrl}
                  fullWidth={isMobile || isTablet}
                />
              </Link>
            ))}
          </div>
        </section>
        {/* 일반 게시글 목록 영역 (추후 구현) */}
        <div className="border-border-primary bg-background-secondary mt-8 rounded-lg border p-8 text-center">
          <p className="text-color-secondary">
            게시글 목록이 여기에 표시됩니다.
          </p>
        </div>
      </div>

      {/* 플로팅 글쓰기 버튼 (데스크톱만) */}
      {!isMobile && !isTablet && (
        <Link
          to="/boards/write"
          className="fixed right-[120px] bottom-[76px] flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-colors hover:bg-blue-600"
        >
          <PlusIcon className="h-6 w-6 text-white" />
        </Link>
      )}
    </div>
  );
}
