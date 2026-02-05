import { useState } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import HeartIcon from "@/assets/heart.svg";
import KebabIcon from "@/assets/kebab.svg";
import ProfileIcon from "@/assets/icon.svg";
import EnterIcon from "@/features/boards/assets/enter.svg";

// 댓글 타입
interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

// 더미 데이터
const MOCK_ARTICLE = {
  id: 1,
  title: "커피 머신 고장 신고합니다 ☕🚨",
  author: "우지은",
  date: "2024. 07. 25",
  content: `오늘 아침 출근과 동시에 알게 된 사실...
1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)
 점검 요청했고, 최대한 빠르게 복구될 수 있도록 하겠습니다!
 혹시 대체 커피 루트 아시는 분 계시면 공유 부탁드려요 ㅎㅎ`,
  imageUrl:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
  likeCount: 999,
};

/**
 * 게시글 상세 페이지
 */
export default function BoardDetail() {
  const isMobile = useIsMobile(); // < 768px
  const isTablet = useIsMobile("lg"); // < 1024px

  // 댓글 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: "우지은",
      content: commentInput,
      date: "2024. 07. 25",
    };
    setComments((prev) => [...prev, newComment]);
    setCommentInput("");
  };

  // 좋아요 수 포맷
  const formatLikeCount = (count: number) => {
    if (count > 999) return "999+";
    return count.toString();
  };

  // 반응형 스타일
  const cardWidth = isMobile ? "w-full" : isTablet ? "w-[620px]" : "w-[900px]";
  const cardPadding = isMobile
    ? "px-4 pt-10 pb-6"
    : isTablet
      ? "px-10 pt-16 pb-8"
      : "px-[60px] pt-[84px] pb-10";

  // 텍스트 크기
  const titleSize = isMobile ? "text-lg" : "text-xl";
  const bodySize = isMobile ? "text-sm" : "text-base";
  const metaSize = isMobile ? "text-xs" : "text-sm";
  const commentLabelSize = isMobile ? "text-sm" : "text-lg";
  const commentTextSize = isMobile ? "text-[13px]" : "text-sm";

  // 댓글 사이 패딩
  const commentGap = isMobile ? "py-3" : "py-5";

  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div
        className={`${isMobile ? "px-4 pt-6" : isTablet ? "mx-auto pt-10" : "ml-[184px] pt-14"}`}
      >
        {/* 메인 카드 + 하트 버튼 컨테이너 */}
        <div className={`relative ${isTablet ? "" : "w-fit"}`}>
          {/* 메인 카드 */}
          <article
            className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardPadding} ${isTablet ? "mx-auto" : ""}`}
          >
            {/* 제목 + 케밥 */}
            <div className="flex items-start justify-between">
              <h1 className={`${titleSize} font-bold text-slate-800`}>
                {MOCK_ARTICLE.title}
              </h1>
              <button type="button" className="flex-shrink-0">
                <KebabIcon className="h-6 w-6 text-slate-500" />
              </button>
            </div>

            {/* 프로필 영역 */}
            <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-6">
              {/* 프로필 이미지 */}
              <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-200">
                <ProfileIcon className="h-4 w-4" />
              </div>
              <span className={`${metaSize} font-medium text-slate-800`}>
                {MOCK_ARTICLE.author}
              </span>
              <div className="h-3 w-px bg-slate-700" />
              <span className={`${metaSize} font-medium text-slate-400`}>
                {MOCK_ARTICLE.date}
              </span>
            </div>

            {/* 본문 */}
            <div className="mt-6">
              <p
                className={`${bodySize} leading-6 whitespace-pre-line text-slate-800`}
              >
                {MOCK_ARTICLE.content}
              </p>
            </div>

            {/* 이미지 */}
            {MOCK_ARTICLE.imageUrl && (
              <div className="mt-6">
                <img
                  src={MOCK_ARTICLE.imageUrl}
                  alt="게시글 이미지"
                  className="h-[200px] w-[200px] rounded-xl object-cover"
                />
              </div>
            )}

            {/* 좋아요 (데스크톱에서는 플로팅, 태블릿/모바일에서는 인라인) */}
            {isTablet && (
              <div className="mt-10 flex items-center justify-end gap-1">
                <HeartIcon className="h-4 w-[18px] text-slate-400" />
                <span className={`${metaSize} text-slate-400`}>
                  {formatLikeCount(MOCK_ARTICLE.likeCount)}
                </span>
              </div>
            )}

            {/* 댓글 섹션 */}
            <section className="mt-10">
              {/* 댓글 타이틀 */}
              <h2 className={`${commentLabelSize} font-bold`}>
                <span className="text-slate-800">댓글 </span>
                <span className="text-blue-500">{comments.length}</span>
              </h2>

              {/* 댓글 입력 */}
              <div className="mt-4 flex items-center gap-4 border-y border-slate-200 py-3">
                {/* 프로필 */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200">
                  <ProfileIcon className="h-5 w-5" />
                </div>

                {/* 입력창 */}
                <div className="flex flex-1 items-center">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="댓글을 달아주세요"
                    className={`${metaSize} flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none`}
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="flex-shrink-0"
                  >
                    <EnterIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* 댓글 목록 */}
              {comments.length === 0 ? (
                /* 빈 댓글 상태 */
                <div className="mt-5 border-t border-slate-200 pt-9">
                  <div className="flex h-[120px] items-center justify-center rounded-lg bg-slate-50">
                    <p className={`${metaSize} text-slate-400`}>
                      아직 작성된 댓글이 없습니다.
                    </p>
                  </div>
                </div>
              ) : (
                /* 댓글 있을 때 */
                <div className="mt-4">
                  {comments.map((comment, index) => (
                    <div key={comment.id}>
                      {/* 구분선 (첫 번째 댓글 제외) */}
                      {index > 0 && (
                        <div className="border-t border-slate-200" />
                      )}

                      <div className={`flex gap-3 ${commentGap}`}>
                        {/* 프로필 */}
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200">
                          <ProfileIcon className="h-5 w-5" />
                        </div>

                        {/* 댓글 내용 */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`${metaSize} font-medium text-slate-800`}
                            >
                              {comment.author}
                            </span>
                            <button type="button">
                              <KebabIcon className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                          <p
                            className={`${commentTextSize} mt-1 leading-5 text-slate-800`}
                          >
                            {comment.content}
                          </p>
                          <span
                            className={`${metaSize} mt-2 block text-slate-400`}
                          >
                            {comment.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </article>

          {/* 하트 버튼 (데스크톱만) - 카드 오른쪽 26px 떨어짐, 위에서 251px */}
          {!isTablet && (
            <div className="absolute top-[251px] left-[calc(900px+26px)]">
              <div className="flex flex-col items-center gap-2">
                {/* 하트 원 - 64px, 테두리만 */}
                <button
                  type="button"
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-white"
                >
                  <HeartIcon className="h-6 w-6 text-slate-400" />
                </button>
                {/* 숫자 */}
                <span className="text-sm text-slate-500">
                  {formatLikeCount(MOCK_ARTICLE.likeCount)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
