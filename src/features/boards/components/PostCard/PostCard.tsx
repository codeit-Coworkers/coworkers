import HeartIcon from "../../../../assets/heart.svg";
import BestIcon from "../../../../assets/best.svg";

export interface PostCardProps {
  /**
   * 카드 상태
   * - 'best': 베스트 게시글 (인기 칩 표시)
   * - 'default': 일반 게시글
   */
  state: "best" | "default";

  /**
   * 카드 크기
   * - 'large': 큰 카드
   * - 'small': 작은 카드
   */
  size: "large" | "small";

  /**
   * 이미지 표시 여부
   */
  hasImage: boolean;

  /**
   * 게시글 제목
   */
  title: string;

  /**
   * 게시글 본문 (미리보기)
   */
  content: string;

  /**
   * 작성자 이름
   */
  author: string;

  /**
   * 작성 날짜 (예: "2024. 07. 25")
   */
  date: string;

  /**
   * 좋아요 수
   */
  likeCount: number;

  /**
   * 이미지 URL (hasImage가 true일 때 필요)
   */
  imageUrl?: string;
}

/**
 * PostCard 컴포넌트
 *
 * @description
 * 자유게시판 게시글 카드 컴포넌트입니다.
 * state(best/default)와 size(large/small), hasImage(true/false) 조합으로 사용합니다.
 */
export default function PostCard({
  state,
  size,
  hasImage,
  title,
  content,
  author,
  date,
  likeCount,
  imageUrl,
}: PostCardProps) {
  // 카드 크기 스타일
  const getCardSizeStyles = () => {
    if (state === "best") {
      if (size === "large") {
        return "w-[350px] h-[210px] pt-6 pb-7 px-5";
      }
      return "w-[304px] h-[177px] p-5";
    }
    if (size === "large") {
      return "w-[523px] h-[156px] py-5 px-6";
    }
    return "w-[340px] h-[140px] p-4";
  };

  // 이미지 크기
  const imageSize =
    state === "best"
      ? size === "large"
        ? 60
        : 48
      : size === "large"
        ? 88
        : 80;

  // 제목 스타일
  const titleClass = size === "large" ? "text-2lg-b" : "text-lg-b";

  // 본문 스타일
  const contentStyle =
    size === "large"
      ? { fontSize: "14px", lineHeight: "20px" }
      : { fontSize: "13px", lineHeight: "18px" };

  // 작성자 스타일
  const authorClass =
    state === "best" && size === "large" ? "text-md-m" : "text-sm-m";

  // 하트 개수 스타일
  const likeCountClass =
    state === "best" && size === "large" ? "text-md-r" : "text-sm-m";

  // 칩과 콘텐츠 사이 간격
  const chipGap = size === "large" ? "gap-4" : "gap-3";

  // 콘텐츠와 이름행 사이 간격
  const contentAuthorGap = state === "best" ? "" : "gap-3";

  // 좋아요 수 포맷
  const formatLikeCount = (count: number) => {
    if (count > 999) return "999+";
    return count.toString();
  };

  // Best 카드 레이아웃
  if (state === "best") {
    return (
      <article
        className={`bg-background-inverse flex flex-col ${chipGap} rounded-[20px] ${getCardSizeStyles()}`}
      >
        {/* 인기 칩 */}
        <div className="bg-background-secondary flex h-[30px] w-[72px] items-center justify-center gap-1 rounded-xl">
          <BestIcon className="text-brand-primary h-[18px] w-[18px]" />
          <span className="text-md-b text-brand-primary">인기</span>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-1 flex-col justify-between">
          {/* 제목 + 본문 + 이미지 */}
          <div className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className={`${titleClass} text-color-primary truncate`}>
                {title}
              </h3>
              <p
                className="text-color-default line-clamp-2"
                style={contentStyle}
              >
                {content}
              </p>
            </div>
            {hasImage && imageUrl && (
              <img
                src={imageUrl}
                alt="게시글 이미지"
                className="flex-shrink-0 rounded-lg object-cover"
                style={{ width: imageSize, height: imageSize }}
              />
            )}
          </div>

          {/* 작성자 행 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`${authorClass} text-color-primary`}>
                {author}
              </span>
              <div className="bg-color-secondary h-3 w-px" />
              <span className={`${authorClass} text-interaction-inactive`}>
                {date}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="text-interaction-inactive h-4 w-[18px]" />
              <span className={`${likeCountClass} text-interaction-inactive`}>
                {formatLikeCount(likeCount)}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default 카드 레이아웃
  return (
    <article
      className={`bg-background-inverse flex flex-col rounded-[20px] ${getCardSizeStyles()} ${contentAuthorGap}`}
    >
      {/* 제목 + 본문 + 이미지 */}
      <div className="flex flex-1 items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className={`${titleClass} text-color-primary truncate`}>
            {title}
          </h3>
          <p className="text-color-default line-clamp-2" style={contentStyle}>
            {content}
          </p>
        </div>
        {hasImage && imageUrl && (
          <img
            src={imageUrl}
            alt="게시글 이미지"
            className="flex-shrink-0 rounded-lg object-cover"
            style={{ width: imageSize, height: imageSize }}
          />
        )}
      </div>

      {/* 작성자 행 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${authorClass} text-color-primary`}>{author}</span>
          <div className="bg-color-secondary h-3 w-px" />
          <span className={`${authorClass} text-interaction-inactive`}>
            {date}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <HeartIcon className="text-interaction-inactive h-4 w-[18px]" />
          <span className={`${likeCountClass} text-interaction-inactive`}>
            {formatLikeCount(likeCount)}
          </span>
        </div>
      </div>
    </article>
  );
}
