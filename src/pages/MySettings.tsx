import { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FetchBoundary } from "@/providers/boundary";
import { useUser } from "@/api/user";
import { Input } from "@/components/common/Input/Input";
import AlertIcon from "@/assets/alert-white.svg";
import PencilIcon from "@/assets/pencil.svg";
import SecessionIcon from "@/assets/secession.svg";

/**
 * 계정 설정 페이지
 *
 * - 데스크톱: 카드 max-w 940px, h 725px, 내부 가로 패딩 74px, 왼쪽 여백은 글쓰기 페이지와 동일(gnb + 패딩)
 * - 타블렛: 카드 h 745px, 가운데 정렬·가로 축소, 내부 가로 패딩 45px
 * - 모바일: 흰 카드 h 566px, 프로필 이미지 64x64 (데스크/타블렛 100x100, 둥글기 8)
 * - 미저장 시 하단 파란 바(Toast 스타일) 노출
 */
function MySettingsContent() {
  const isMobile = useIsMobile();
  const isTabletOrSmaller = useIsMobile("lg");
  const isTablet = !isMobile && isTabletOrSmaller;

  const { data: user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(user.image);

  const hasUnsavedChanges =
    nickname !== user.nickname || profileImageUrl !== user.image;

  // 카드 레이아웃 (BoardWrite와 동일한 왼쪽 여백)
  // 타블렛: GNB와 흰 카드 사이 최소 56px, 모바일: 최소 16px
  const outerWrapperClass = isMobile
    ? "px-4 pt-6" // 16px
    : isTablet
      ? "px-[56px] mx-auto pt-10"
      : "ml-[184px] pt-14";

  const cardWidth = isMobile || isTablet ? "w-full" : "w-[940px]";
  const cardMaxWidth = "max-w-[940px]";
  const cardHeight = isMobile
    ? "min-h-[566px]"
    : isTablet
      ? "min-h-[745px]"
      : "h-[725px]";
  const cardInnerPaddingX = isMobile
    ? "px-4"
    : isTablet
      ? "px-[45px]"
      : "px-[74px]";

  const profileSize = isMobile ? "h-16 w-16" : "h-[100px] w-[100px]";
  const profileRadius = "rounded-[8px]";

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImageUrl(url);
    e.target.value = "";
  };

  const handleSave = () => {
    // TODO: API 연동 시 저장 요청
  };

  return (
    <div className="bg-background-secondary min-h-screen pb-24">
      <div className={outerWrapperClass}>
        <div
          className={`relative ${isMobile || isTablet ? "w-full" : "w-fit"}`}
        >
          <article
            className={`bg-background-primary rounded-[20px] ${cardWidth} ${cardMaxWidth} ${cardHeight} ${cardInnerPaddingX} pt-10 pb-10 ${isTablet ? "mx-auto" : ""}`}
          >
            <h1 className="text-xl-b text-color-primary mb-8">계정 설정</h1>

            {/* 프로필 이미지: 클릭 시 변경, 우측 하단 연필 아이콘 */}
            <div className="mb-8 flex justify-center">
              <button
                type="button"
                onClick={handleProfileClick}
                className="relative inline-block"
                aria-label="프로필 이미지 변경"
              >
                <img
                  src={profileImageUrl}
                  alt="프로필"
                  className={`${profileSize} ${profileRadius} object-cover`}
                />
                <span
                  className={`bg-background-secondary absolute right-0 bottom-0 flex items-center justify-center rounded-full shadow [&_path]:!fill-[#64748B] ${isMobile ? "h-[18px] w-[18px]" : "h-8 w-8"}`}
                >
                  <PencilIcon
                    className={`shrink-0 ${isMobile ? "h-3.5 w-3.5" : "h-5 w-5"}`}
                  />
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </button>
            </div>

            {/* 이름 */}
            <div className="mb-5">
              <Input
                label="이름"
                size="auth"
                variant="default"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="!h-12"
              />
            </div>

            {/* 이메일 (읽기 전용) */}
            <div className="mb-5">
              <Input
                label="이메일"
                size="auth"
                variant="default"
                value={user.email}
                disabled
                className="bg-surface-secondary !h-12"
              />
            </div>

            {/* 비밀번호 + 변경하기 */}
            <div className="mb-8">
              <Input
                label="비밀번호"
                type="password"
                size="auth"
                variant="default"
                placeholder="··········"
                rightElement={
                  <button
                    type="button"
                    className="text-md-sb text-brand-primary"
                    onClick={() => {}}
                  >
                    변경하기
                  </button>
                }
                className="!h-12"
              />
            </div>

            {/* 회원 탈퇴하기 */}
            <button
              type="button"
              className="text-status-danger flex items-center gap-2"
              onClick={() => {}}
            >
              <SecessionIcon className="h-5 w-5" />
              <span className="text-md-m">회원 탈퇴하기</span>
            </button>
          </article>
        </div>
      </div>

      {/* 미저장 시 하단 고정 바 (Toast 스타일 재활용) */}
      {hasUnsavedChanges && (
        <div className="bg-brand-primary fixed right-0 bottom-0 left-0 z-[99] flex items-center justify-between px-4 py-3 shadow-lg md:px-6 md:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
            <div className="shrink-0">
              <AlertIcon
                width="24"
                height="24"
                className="text-color-inverse"
              />
            </div>
            <span className="text-color-inverse md:text-lg-sb overflow-hidden text-sm text-ellipsis whitespace-nowrap">
              저장하지 않은 변경사항이 있어요!
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="bg-background-inverse text-brand-primary text-md-sb hover:bg-opacity-90 ml-4 h-9 min-w-20 shrink-0 rounded-lg px-3 transition-colors md:h-10 md:min-w-25 md:px-4"
          >
            변경사항 저장하기
          </button>
        </div>
      )}
    </div>
  );
}

export default function MySettings() {
  return (
    <FetchBoundary
      loadingFallback={
        <div className="bg-background-secondary flex min-h-screen items-center justify-center">
          <span className="text-color-default text-md-r">로딩 중...</span>
        </div>
      }
    >
      <MySettingsContent />
    </FetchBoundary>
  );
}
