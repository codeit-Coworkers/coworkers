import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FetchBoundary } from "@/providers/boundary";
import { useArticle, useDeleteArticle, useToggleLike } from "@/api/article";
import { useUser } from "@/api/user";
import {
  useArticleComments,
  useCreateArticleComment,
  useUpdateArticleComment,
  useDeleteArticleComment,
} from "@/api/articleComment";
import type { ArticleComment } from "@/types/articleComment";
import HeartIcon from "@/assets/heart.svg";
import HeartFillIcon from "@/assets/heart-fill.svg";
import ProfileIcon from "@/assets/icon.svg";
import EnterIcon from "@/features/boards/assets/enter.svg";
import Dropdown from "@/components/common/Dropdown/Dropdown";

/**
 * 게시글 상세 페이지
 */
export default function BoardDetail() {
  const { articleId } = useParams<{ articleId: string }>();

  if (!articleId) return null;

  return (
    <FetchBoundary loadingFallback={<BoardDetailSkeleton />}>
      <BoardDetailContent articleId={Number(articleId)} />
    </FetchBoundary>
  );
}

// ─── 상세 콘텐츠 (Suspense 내부) ────────────────────────────

function BoardDetailContent({ articleId }: { articleId: number }) {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;
  const navigate = useNavigate();

  const { data: article } = useArticle(articleId);
  const { data: currentUser } = useUser();
  const deleteMutation = useDeleteArticle();
  const likeMutation = useToggleLike(articleId);

  // 작성자 프로필 이미지 (현재 유저 = 작성자이면 유저 이미지 사용)
  const writerImage =
    currentUser && currentUser.id === article.writer.id
      ? currentUser.image
      : null;

  // 좋아요 토글
  const handleToggleLike = () => {
    likeMutation.mutate(article.isLiked);
  };

  // 삭제
  const handleDelete = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      deleteMutation.mutate(articleId, {
        onSuccess: () => navigate("/boards"),
      });
    }
  };

  // 케밥 메뉴 옵션
  const kebabOptions = [
    {
      label: "수정하기",
      value: "edit",
      action: () => navigate(`/boards/write?edit=${articleId}`),
    },
    {
      label: "삭제하기",
      value: "delete",
      action: handleDelete,
    },
  ];

  // 좋아요 수 포맷
  const formatLikeCount = (count: number) => {
    if (count > 999) return "999+";
    return count.toString();
  };

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  };

  // 반응형 스타일
  const cardWidth = isMobile ? "w-full" : isTablet ? "w-[620px]" : "w-[900px]";
  const cardPadding = isMobile
    ? "px-4 pt-10 pb-6"
    : isTablet
      ? "px-10 pt-16 pb-8"
      : "px-[60px] pt-[84px] pb-10";

  const titleSize = isMobile ? "text-lg" : "text-xl";
  const bodySize = isMobile ? "text-sm" : "text-base";
  const metaSize = isMobile ? "text-xs" : "text-sm";

  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div
        className={`${isMobile ? "px-4 pt-6" : isTablet ? "mx-auto pt-10" : "ml-[184px] pt-14"}`}
      >
        {/* 메인 카드 + 하트 버튼 컨테이너 */}
        <div className={`relative ${isMobile || isTablet ? "" : "w-fit"}`}>
          {/* 메인 카드 */}
          <article
            className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardPadding} ${isTablet ? "mx-auto" : ""}`}
          >
            {/* 제목 + 케밥 */}
            <div className="flex items-start justify-between">
              <h1 className={`${titleSize} font-bold text-slate-800`}>
                {article.title}
              </h1>
              <Dropdown
                trigger="kebab"
                options={kebabOptions}
                keepSelected={false}
                listAlign="center"
              />
            </div>

            {/* 프로필 영역 */}
            <div className="mt-4 flex items-center gap-2 border-b border-slate-200 pb-6">
              <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-slate-200">
                {writerImage ? (
                  <img
                    src={writerImage}
                    alt={article.writer.nickname}
                    className="h-6 w-6 object-cover"
                  />
                ) : (
                  <ProfileIcon className="h-4 w-4" />
                )}
              </div>
              <span className={`${metaSize} font-medium text-slate-800`}>
                {article.writer.nickname}
              </span>
              <div className="h-3 w-px bg-slate-700" />
              <span className={`${metaSize} font-medium text-slate-400`}>
                {formatDate(article.createdAt)}
              </span>
            </div>

            {/* 본문 */}
            <div className="mt-6">
              <p
                className={`${bodySize} leading-6 whitespace-pre-line text-slate-800`}
              >
                {article.content}
              </p>
            </div>

            {/* 이미지 */}
            {article.image && (
              <div className="mt-6">
                <img
                  src={article.image}
                  alt="게시글 이미지"
                  className="h-[200px] w-[200px] rounded-xl object-cover"
                />
              </div>
            )}

            {/* 좋아요 (태블릿/모바일에서는 인라인) */}
            {(isMobile || isTablet) && (
              <div className="mt-10 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className="flex items-center gap-1"
                  disabled={likeMutation.isPending}
                >
                  {article.isLiked ? (
                    <HeartFillIcon className="text-status-danger h-4 w-[18px]" />
                  ) : (
                    <HeartIcon className="h-4 w-[18px] text-slate-400" />
                  )}
                  <span className={`${metaSize} text-slate-400`}>
                    {formatLikeCount(article.likeCount)}
                  </span>
                </button>
              </div>
            )}

            {/* 댓글 섹션 */}
            <CommentSection
              articleId={articleId}
              commentCount={article.commentCount}
            />
          </article>

          {/* 하트 버튼 (데스크톱만) - 카드 오른쪽 */}
          {!isMobile && !isTablet && (
            <div className="absolute top-[251px] left-[calc(900px+26px)]">
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={likeMutation.isPending}
                  className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 bg-white transition-colors"
                >
                  {article.isLiked ? (
                    <HeartFillIcon className="text-status-danger h-6 w-6" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-slate-400" />
                  )}
                </button>
                <span className="text-sm text-slate-500">
                  {formatLikeCount(article.likeCount)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 댓글 섹션 ─────────────────────────────────────────────

function CommentSection({
  articleId,
  commentCount,
}: {
  articleId: number;
  commentCount: number;
}) {
  const isMobile = useIsMobile();
  const metaSize = isMobile ? "text-xs" : "text-sm";
  const commentLabelSize = isMobile ? "text-sm" : "text-lg";
  const commentTextSize = isMobile ? "text-[13px]" : "text-sm";
  const commentGap = isMobile ? "py-3" : "py-5";

  const [commentInput, setCommentInput] = useState("");

  // 현재 로그인 유저 정보 (프로필 이미지)
  const { data: currentUser } = useUser();

  // 댓글 목록 (커서 기반 무한스크롤)
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArticleComments(articleId);

  const allComments = commentData?.pages.flatMap((page) => page.list) ?? [];

  // 댓글 작성
  const createComment = useCreateArticleComment(articleId);

  const handleAddComment = () => {
    if (!commentInput.trim() || createComment.isPending) return;
    createComment.mutate(commentInput.trim(), {
      onSuccess: () => setCommentInput(""),
    });
  };

  return (
    <section className="mt-10">
      {/* 댓글 타이틀 */}
      <h2 className={`${commentLabelSize} font-bold`}>
        <span className="text-slate-800">댓글 </span>
        <span className="text-brand-primary">{commentCount}</span>
      </h2>

      {/* 댓글 입력 */}
      <div className="mt-4 flex items-center gap-4 border-y border-slate-200 py-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-200">
          {currentUser?.image ? (
            <img
              src={currentUser.image}
              alt={currentUser.nickname}
              className="h-8 w-8 object-cover"
            />
          ) : (
            <ProfileIcon className="h-5 w-5" />
          )}
        </div>
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
            disabled={createComment.isPending}
            className="flex-shrink-0 disabled:opacity-50"
          >
            <EnterIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      {allComments.length === 0 ? (
        <div className="mt-5 border-t border-slate-200 pt-9">
          <div className="flex h-[120px] items-center justify-center rounded-lg bg-slate-50">
            <p className={`${metaSize} text-slate-400`}>
              아직 작성된 댓글이 없습니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {allComments.map((comment, index) => (
            <div key={comment.id}>
              {index > 0 && <div className="border-t border-slate-200" />}
              <CommentItem
                comment={comment}
                articleId={articleId}
                metaSize={metaSize}
                commentTextSize={commentTextSize}
                commentGap={commentGap}
              />
            </div>
          ))}

          {/* 더보기 버튼 */}
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-md-m text-brand-primary hover:text-interaction-hover transition-colors"
              >
                {isFetchingNextPage ? "불러오는 중..." : "댓글 더보기"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── 댓글 아이템 ────────────────────────────────────────────

function CommentItem({
  comment,
  articleId,
  metaSize,
  commentTextSize,
  commentGap,
}: {
  comment: ArticleComment;
  articleId: number;
  metaSize: string;
  commentTextSize: string;
  commentGap: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const updateComment = useUpdateArticleComment(articleId);
  const deleteComment = useDeleteArticleComment(articleId);

  const handleUpdate = () => {
    if (!editContent.trim() || updateComment.isPending) return;
    updateComment.mutate(
      { commentId: comment.id, content: editContent.trim() },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment.mutate(comment.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  };

  const kebabOptions = [
    {
      label: "수정하기",
      value: "edit",
      action: () => {
        setEditContent(comment.content);
        setIsEditing(true);
      },
    },
    {
      label: "삭제하기",
      value: "delete",
      action: handleDelete,
    },
  ];

  return (
    <div className={`flex gap-3 ${commentGap}`}>
      {/* 프로필 */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200">
        {comment.writer.image ? (
          <img
            src={comment.writer.image}
            alt={comment.writer.nickname}
            className="h-8 w-8 rounded-lg object-cover"
          />
        ) : (
          <ProfileIcon className="h-5 w-5" />
        )}
      </div>

      {/* 댓글 내용 */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={`${metaSize} font-medium text-slate-800`}>
            {comment.writer.nickname}
          </span>
          <Dropdown
            trigger="kebab"
            options={kebabOptions}
            keepSelected={false}
            listAlign="center"
          />
        </div>

        {isEditing ? (
          /* 수정 모드 */
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className={`${commentTextSize} flex-1 rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none`}
              autoFocus
            />
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateComment.isPending}
              className="text-sm-m text-brand-primary hover:text-interaction-hover"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm-m text-color-default"
            >
              취소
            </button>
          </div>
        ) : (
          /* 일반 모드 */
          <p className={`${commentTextSize} mt-1 leading-5 text-slate-800`}>
            {comment.content}
          </p>
        )}

        <span className={`${metaSize} mt-2 block text-slate-400`}>
          {formatDate(comment.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ─── 로딩 스켈레톤 ──────────────────────────────────────────

function BoardDetailSkeleton() {
  return (
    <div className="bg-background-secondary min-h-screen pb-20">
      <div className="ml-[184px] pt-14">
        <div className="bg-background-primary h-[500px] w-[900px] animate-pulse rounded-[20px]" />
      </div>
    </div>
  );
}
