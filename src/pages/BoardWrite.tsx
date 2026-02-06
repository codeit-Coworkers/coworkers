import { useIsMobile } from "@/hooks/useMediaQuery";
import TitleInput from "@/features/boards/components/TitleInput";
import ContentInput from "@/features/boards/components/ContentInput";
import ImageUpload from "@/features/boards/components/ImageUpload";

/**
 * 게시글 쓰기 페이지
 *
 * @description
 * 재사용 가능한 컴포넌트들을 조립하여 구성한 페이지입니다.
 * - TitleInput: 제목 입력
 * - ContentInput: 내용 입력 (Textarea)
 * - ImageUpload: 이미지 업로드 (추후 로직 추가)
 */
export default function BoardWrite() {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;

  // BoardDetail과 동일한 하얀 박스 스타일
  const cardWidth = isMobile ? "w-full" : isTablet ? "w-[620px]" : "w-[900px]";
  const cardPadding = isMobile
    ? "px-4 pt-10 pb-6"
    : isTablet
      ? "px-10 pt-16 pb-8"
      : "px-[60px] pt-[84px] pb-10";

  // 반응형 스타일
  const titleBottomPadding = isMobile ? "mb-8" : "mb-10";

  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div
        className={`${isMobile ? "px-4 pt-6" : isTablet ? "mx-auto pt-10" : "ml-[184px] pt-14"}`}
      >
        {/* 메인 카드 컨테이너 */}
        <div className={`relative ${isMobile || isTablet ? "" : "w-fit"}`}>
          {/* 메인 카드 */}
          <article
            className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardPadding} ${isTablet ? "mx-auto" : ""}`}
          >
            {/* 게시글 쓰기 제목 */}
            <h1
              className={`text-xl-b text-color-primary ${titleBottomPadding}`}
            >
              게시글 쓰기
            </h1>

            {/* 제목 입력 컴포넌트 */}
            <TitleInput />

            {/* 내용 입력 컴포넌트 */}
            <ContentInput />

            {/* 이미지 업로드 컴포넌트 */}
            <ImageUpload />

            {/* 등록하기 버튼 */}
            <button
              type="button"
              className="bg-brand-primary w-full rounded-xl py-3.5 font-semibold text-white transition-colors hover:opacity-90"
            >
              등록하기
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
