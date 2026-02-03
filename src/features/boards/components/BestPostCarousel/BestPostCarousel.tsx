import { useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import PostCard from "../PostCard";
import CarouselDots from "./CarouselDots";
import CarouselArrows from "./CarouselArrows";

// 베스트 게시글 데이터 타입
interface BestPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  likeCount: number;
  imageUrl?: string;
}

interface BestPostCarouselProps {
  /** 베스트 게시글 목록 */
  posts: BestPost[];
  /** 더보기 클릭 핸들러 */
  onMoreClick?: () => void;
}

/**
 * 베스트 게시글 캐러셀 컴포넌트
 *
 * @description
 * 데스크톱: 3개 카드 (large)
 * 태블릿: 2개 카드 (small)
 * 모바일: 1개 카드 (small)
 */
export default function BestPostCarousel({
  posts,
  onMoreClick,
}: BestPostCarouselProps) {
  const isMobile = useIsMobile(); // < 768px
  const isTablet = useIsMobile("lg"); // < 1024px

  // 화면 크기에 따른 카드 개수 및 사이즈
  const cardsPerPage = isMobile ? 1 : isTablet ? 2 : 3;
  const cardSize = isMobile || isTablet ? "small" : "large";

  // 총 페이지 수
  const totalPages = Math.ceil(posts.length / cardsPerPage);

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(0);

  // 현재 페이지에 표시할 카드들
  const startIndex = currentPage * cardsPerPage;
  const visiblePosts = posts.slice(startIndex, startIndex + cardsPerPage);

  // 페이지 이동
  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // 제목 크기 (모바일: 18px, 그 외: 20px)
  const titleClass = isMobile ? "text-2lg-b" : "text-xl-b";

  return (
    <section className="bg-background-secondary rounded-xl p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`${titleClass} text-color-primary`}>베스트 게시글</h2>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-md-r flex items-center gap-1 text-[#94A3B8] transition-colors hover:text-[#64748B]"
        >
          더보기
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="#475569"
              strokeWidth="1.54"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 카드 영역 */}
      <div className="flex gap-3">
        {visiblePosts.map((post) => (
          <PostCard
            key={post.id}
            state="best"
            size={cardSize}
            title={post.title}
            content={post.content}
            author={post.author}
            date={post.date}
            likeCount={post.likeCount}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>

      {/* 컨트롤 영역 (점: 가운데, 화살표: 오른쪽 끝) */}
      {totalPages > 1 && (
        <div className="relative mt-6 flex items-center justify-center">
          {/* 점 (가운데) */}
          <CarouselDots
            total={totalPages}
            current={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* 화살표 (오른쪽 끝) */}
          <div className="absolute right-0">
            <CarouselArrows
              onPrev={handlePrev}
              onNext={handleNext}
              disablePrev={currentPage === 0}
              disableNext={currentPage === totalPages - 1}
            />
          </div>
        </div>
      )}
    </section>
  );
}
