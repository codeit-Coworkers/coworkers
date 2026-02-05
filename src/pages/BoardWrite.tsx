import { useIsMobile } from "@/hooks/useMediaQuery";
import { Input } from "@/components/common/Input/Input";

/**
 * 게시글 쓰기 페이지
 */
export default function BoardWrite() {
  const isMobile = useIsMobile(); // < 768px
  const isTabletOrSmaller = useIsMobile("lg"); // < 1024px
  const isTablet = !isMobile && isTabletOrSmaller;

  // BoardDetail과 동일한 하얀 박스 스타일
  const cardWidth = isMobile ? "w-full" : isTablet ? "w-[620px]" : "w-[900px]";
  const cardPadding = isMobile
    ? "px-4 pt-10 pb-6"
    : isTablet
      ? "px-10 pt-16 pb-8"
      : "px-[60px] pt-[84px] pb-10";

  // 반응형 스타일
  const titleBottomPadding = isMobile ? "mb-8" : "mb-10"; // 32px / 40px
  const labelSize = isMobile ? "text-md-b" : "text-lg-b"; // 14px / 16px
  const asteriskPadding = isMobile ? "ml-1" : "ml-1.5"; // 4px / 6px
  const labelBottomPadding = isMobile ? "mb-2" : "mb-3"; // 8px / 12px
  const titleInputBottomPadding = isMobile ? "mb-6" : "mb-8"; // 24px / 32px
  const contentBottomPadding = isMobile ? "mb-2" : "mb-3"; // 8px / 12px
  const imageBoxSize = isMobile ? "w-20 h-20" : "w-[120px] h-[120px]"; // 80x80 / 120x120
  const iconTextGap = isMobile ? "gap-1" : "gap-4"; // 4px / 16px
  const imageBottomPadding = isMobile ? "mb-12" : "mb-[57px]"; // 48px / 57px
  const contentHeight = isMobile ? 200 : 240;

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

            {/* 제목 입력란 */}
            <div className={titleInputBottomPadding}>
              <label
                className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
              >
                제목
                <span className={`text-status-danger ${asteriskPadding}`}>
                  *
                </span>
              </label>
              <Input
                size="title"
                variant="default"
                placeholder="제목을 입력해주세요"
                className="!border-border-primary w-full"
              />
            </div>

            {/* 내용 입력란 */}
            <div className={contentBottomPadding}>
              <label
                className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
              >
                내용
                <span className={`text-status-danger ${asteriskPadding}`}>
                  *
                </span>
              </label>
              <Input
                size="content"
                variant="default"
                placeholder="내용을 입력하세요"
                className="!border-border-primary w-full"
                style={{ height: contentHeight }}
              />
            </div>

            {/* 이미지 업로드 */}
            <div className={imageBottomPadding}>
              <label
                className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
              >
                이미지
              </label>
              <button
                type="button"
                className={`border-border-primary rounded-xl border ${imageBoxSize} flex flex-col items-center justify-center ${iconTextGap} bg-background-primary hover:bg-background-secondary transition-colors`}
              >
                {/* 이미지 아이콘 */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-slate-400"
                >
                  <path
                    d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                    fill="currentColor"
                  />
                </svg>
                {/* 이미지 개수 */}
                <span className="text-color-default text-sm">0/5</span>
              </button>
            </div>

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
