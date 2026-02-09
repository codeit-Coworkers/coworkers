import BoardListHeader from "@/features/boards/components/BoardListHeader";
import BoardListSection from "@/features/boards/components/BoardListSection";
import BestPostSection from "@/features/boards/components/BestPostSection";
import FloatingWriteButton from "@/features/boards/components/FloatingWriteButton";
import { FetchBoundary } from "@/providers/boundary";
import { useBoardList } from "@/features/boards/hooks/useBoardList";

/**
 * 자유게시판 페이지
 *
 * - 데스크톱/태블릿: 페이지네이션
 * - 모바일: 무한 스크롤
 */
export default function Boards() {
  const boardList = useBoardList();

  return (
    <div className="!bg-background-primary min-h-screen pb-20">
      <div className="mx-auto max-w-[1120px] px-4 md:px-6">
        <BoardListHeader
          keyword={boardList.keyword}
          onKeywordChange={boardList.setKeyword}
          headerMarginClass={boardList.headerMarginClass}
          titleClass={boardList.titleClass}
          isMobile={boardList.isMobile}
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

        <BoardListSection
          sectionGapClass={boardList.sectionGapClass}
          handleSortChange={boardList.handleSortChange}
          isMobile={boardList.isMobile}
          isTablet={boardList.isTablet}
          isLoading={boardList.isLoading}
          displayArticles={boardList.displayArticles}
          debouncedKeyword={boardList.debouncedKeyword}
          gridClass={boardList.gridClass}
          cardSize={boardList.cardSize}
          data={boardList.data}
          pageSize={boardList.pageSize}
          page={boardList.page}
          setPage={boardList.setPage}
          observerRef={boardList.observerRef}
          hasNextPage={boardList.hasNextPage}
          isFetching={boardList.isFetching}
        />
      </div>

      {!boardList.isMobile && !boardList.isTablet && <FloatingWriteButton />}
    </div>
  );
}
