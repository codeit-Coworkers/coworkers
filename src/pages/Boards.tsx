import { Link } from "react-router-dom";
import BestPostCarousel from "@/features/boards/components/BestPostCarousel";
import PostCard from "@/features/boards/components/PostCard";
import BoardListHeader from "@/features/boards/components/BoardListHeader";
import BoardListSectionHeader from "@/features/boards/components/BoardListSectionHeader";
import BoardListSkeleton from "@/features/boards/components/BoardListSkeleton";
import BoardListEmpty from "@/features/boards/components/BoardListEmpty";
import Pagination from "@/components/common/Pagination/Pagination";
import { FetchBoundary } from "@/providers/boundary";
import { useBestArticles } from "@/api/article";
import type { ArticleSummary } from "@/types/article";
import { formatDate } from "@/utils/format";
import { useBoardList } from "@/features/boards/hooks/useBoardList";
import PlusIcon from "@/assets/plus.svg";

// ─── 베스트 게시글 섹션 (Suspense 내부) ─────────────────────

function BestPostSection() {
  const { data } = useBestArticles(15);
  const bestPosts = data.list.map(toBestPost);
  return <BestPostCarousel posts={bestPosts} />;
}

/**
 * 자유게시판 페이지
 *
 * - 데스크톱/태블릿: 페이지네이션
 * - 모바일: 무한 스크롤
 */
export default function Boards() {
  const {
    keyword,
    setKeyword,
    debouncedKeyword,
    page,
    setPage,
    data,
    isLoading,
    isFetching,
    displayArticles,
    observerRef,
    hasNextPage,
    isMobile,
    isTablet,
    pageSize,
    gridClass,
    headerMarginClass,
    titleClass,
    sectionGapClass,
    cardSize,
    handleSortChange,
  } = useBoardList();

  return (
    <div className="!bg-background-primary min-h-screen pb-20">
      <div className="mx-auto max-w-[1120px] px-4 md:px-6">
        <BoardListHeader
          keyword={keyword}
          onKeywordChange={setKeyword}
          headerMarginClass={headerMarginClass}
          titleClass={titleClass}
          isMobile={isMobile}
        />

        <FetchBoundary
          loadingFallback={
            <div className="bg-background-secondary flex h-[280px] animate-pulse items-center justify-center rounded-xl">
              <span className="text-color-default text-md-r">
                베스트 게시글 로딩 중...
              </span>
            </div>
          }
        >
          <BestPostSection />
        </FetchBoundary>

        <section className={sectionGapClass}>
          <BoardListSectionHeader
            onSortChange={handleSortChange}
            isMobile={isMobile}
            isTablet={isTablet}
          />

          {isLoading && displayArticles.length === 0 ? (
            <BoardListSkeleton />
          ) : displayArticles.length > 0 ? (
            <div className={gridClass}>
              {displayArticles.map((article) => (
                <Link key={article.id} to={`/boards/${article.id}`}>
                  <PostCard
                    state="default"
                    size={cardSize}
                    title={article.title}
                    content=""
                    author={article.writer.nickname}
                    date={formatDate(article.createdAt)}
                    likeCount={article.likeCount}
                    imageUrl={article.image ?? undefined}
                    fullWidth={isMobile || isTablet}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <BoardListEmpty keyword={debouncedKeyword || undefined} />
          )}

          {!isMobile && data && data.totalCount > pageSize && (
            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalCount={data.totalCount}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </div>
          )}

          {isMobile && hasNextPage && (
            <div ref={observerRef} className="flex justify-center py-6">
              {isFetching && (
                <span className="text-md-r text-color-default">
                  불러오는 중...
                </span>
              )}
            </div>
          )}

          {!isMobile && isFetching && !isLoading && (
            <div className="pointer-events-none fixed inset-0 z-40 bg-white/30" />
          )}
        </section>
      </div>

      {!isMobile && !isTablet && (
        <Link
          to="/boards/write"
          className="bg-brand-primary hover:bg-interaction-hover fixed right-[120px] bottom-[76px] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors"
        >
          <PlusIcon className="h-6 w-6 text-white" />
        </Link>
      )}
    </div>
  );
}

function toBestPost(article: ArticleSummary) {
  return {
    id: article.id,
    title: article.title,
    content: "",
    author: article.writer.nickname,
    date: formatDate(article.createdAt),
    likeCount: article.likeCount,
    imageUrl: article.image ?? undefined,
  };
}
