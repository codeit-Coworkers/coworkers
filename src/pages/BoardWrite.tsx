import { useIsMobile } from "@/hooks/useMediaQuery";

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

  // 텍스트 크기
  const titleSize = isMobile ? "text-lg" : "text-xl";

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
            {/* 제목 */}
            <h1 className={`${titleSize} mb-8 font-bold text-slate-800`}>
              게시글 쓰기
            </h1>

            {/* 제목 입력란 */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                제목 <span className="text-red-500">*</span>
              </label>
              {/* 인풋 컴포넌트는 나중에 추가 */}
              <div className="rounded-lg bg-slate-100 p-4 text-slate-400">
                제목을 입력해주세요.
              </div>
            </div>

            {/* 내용 입력란 */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                내용 <span className="text-red-500">*</span>
              </label>
              {/* 인풋 컴포넌트는 나중에 추가 */}
              <div className="min-h-[200px] rounded-lg bg-slate-100 p-4 text-slate-400">
                내용을 입력하세요
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                이미지
              </label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-8">
                <div className="text-center">
                  <div className="mb-2 text-slate-400">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="mx-auto"
                    >
                      <circle cx="24" cy="24" r="24" fill="#E2E8F0" />
                      <path
                        d="M24 20V28M20 24H28"
                        stroke="#94A3B8"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-400">0/5</p>
                </div>
              </div>
            </div>

            {/* 등록하기 버튼 */}
            <button
              type="button"
              className="w-full rounded-lg bg-blue-500 py-4 font-medium text-white transition-colors hover:bg-blue-600"
            >
              등록하기
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}
