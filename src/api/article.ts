// ========================================
// Article API
// Swagger: Article
// 게시글 CRUD + 좋아요 API & React Query 훅
// ========================================

import { BASE_URL } from "./config";
import { TASKIFY_ACCESS_TOKEN } from "./auth";
import { fetchClient } from "@/lib/fetchClient";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  ArticleListResponse,
  ArticleListParams,
  ArticleDetail,
  ArticleCreateRequest,
  ArticleCreateResponse,
  ArticleDeleteResponse,
} from "@/types/article";

// ─── 공통 헤더 ──────────────────────────────────────────────

const authHeaders = {
  Authorization: `Bearer ${TASKIFY_ACCESS_TOKEN}`,
};

// ─── API 함수 ───────────────────────────────────────────────

/** 게시글 목록 조회 */
export async function getArticles(
  params: ArticleListParams = {},
): Promise<ArticleListResponse> {
  const { page = 1, pageSize = 10, orderBy = "recent", keyword } = params;

  const url = new URL(`${BASE_URL}/articles`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("orderBy", orderBy);
  if (keyword) {
    url.searchParams.set("keyword", keyword);
  }

  return fetchClient(url.toString(), {
    method: "GET",
    headers: authHeaders,
  });
}

/** 게시글 상세 조회 */
export async function getArticle(articleId: number): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}`, {
    method: "GET",
    headers: authHeaders,
  });
}

/** 게시글 생성 */
export async function createArticle(
  body: ArticleCreateRequest,
): Promise<ArticleCreateResponse> {
  return fetchClient(`${BASE_URL}/articles`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(body),
  });
}

/** 게시글 수정 */
export async function updateArticle(
  articleId: number,
  body: Partial<ArticleCreateRequest>,
): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(body),
  });
}

/** 게시글 삭제 */
export async function deleteArticle(
  articleId: number,
): Promise<ArticleDeleteResponse> {
  return fetchClient(`${BASE_URL}/articles/${articleId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
}

/** 게시글 좋아요 */
export async function likeArticle(articleId: number): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}/like`, {
    method: "POST",
    headers: authHeaders,
  });
}

/** 게시글 좋아요 취소 */
export async function unlikeArticle(articleId: number): Promise<ArticleDetail> {
  return fetchClient(`${BASE_URL}/articles/${articleId}/like`, {
    method: "DELETE",
    headers: authHeaders,
  });
}

// ─── React Query 훅 ────────────────────────────────────────

/**
 * 게시글 목록 조회 훅 (페이지네이션용)
 *
 * - keepPreviousData로 페이지 전환 시 깜빡임 방지
 * - useSuspenseQuery 대신 useQuery 사용 (페이지 전환 시 Suspense 재발동 방지)
 */
export function useArticles(params: ArticleListParams = {}) {
  return useQuery<ArticleListResponse>({
    queryKey: ["articles", params],
    queryFn: () => getArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 베스트 게시글 조회 훅
 *
 * - 좋아요순 상위 N개를 가져옴
 * - Suspense + ErrorBoundary 지원
 */
export function useBestArticles(pageSize: number = 5) {
  return useSuspenseQuery<ArticleListResponse>({
    queryKey: ["articles", "best", pageSize],
    queryFn: () => getArticles({ page: 1, pageSize, orderBy: "like" }),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 게시글 상세 조회 훅
 *
 * - Suspense + ErrorBoundary 지원
 */
export function useArticle(articleId: number) {
  return useSuspenseQuery<ArticleDetail>({
    queryKey: ["article", articleId],
    queryFn: () => getArticle(articleId),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 게시글 생성 mutation
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

/**
 * 게시글 수정 mutation
 */
export function useUpdateArticle(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<ArticleCreateRequest>) =>
      updateArticle(articleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

/**
 * 게시글 삭제 mutation
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

/**
 * 게시글 좋아요 토글 mutation
 */
export function useToggleLike(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? unlikeArticle(articleId) : likeArticle(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
