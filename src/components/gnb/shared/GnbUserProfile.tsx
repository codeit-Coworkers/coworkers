import { Link } from "react-router-dom";
import UserProfileMobile from "@/assets/user-mobile.svg";
import UserProfile from "@/assets/user.svg";
import { useGnbStore } from "../useGnbStore";
import { useUser } from "@/api/user";

export default function GnbUserProfile() {
  const { data: user } = useUser();

  const { isFolded, selectedItem } = useGnbStore();

  // 현재 선택된 그룹 정보 가져오기
  const selectedGroup = user?.memberships.find(
    (member) => member.groupId === selectedItem,
  );

  // 현재 선택된 팀 이름 (없으면 첫 번째 팀)
  const teamName =
    selectedGroup?.group.name ?? user?.memberships[0]?.group.name;

  if (!user) {
    return (
      <Link
        to="/login"
        aria-label="로그인 페이지로 이동"
        className="inline-flex"
      >
        <span className="inline-flex items-center gap-2">
          <UserProfileMobile className="md:hidden" />
          <UserProfile className="hidden md:block" />
          <span className="hidden md:block">로그인</span>
        </span>
      </Link>
    );
  }

  return (
    <>
      <div>
        <div className="md:hidden">
          <button type="button" aria-label="유저 프로필 모달 열기 버튼">
            <span className="block h-[28px] w-[28px] flex-shrink-0 overflow-hidden rounded-full">
              <img
                src={user.image}
                alt={`${user.nickname} 프로필 이미지`}
                className="h-full w-full object-cover"
              />
            </span>
          </button>
        </div>
        <div className="hidden md:block">
          <button
            type="button"
            aria-label="유저 프로필 모달 열기 버튼"
            className={`flex ${isFolded ? "h-[32px]" : "h-auto"} items-center gap-3`}
          >
            <div
              className={`flex-shrink-0 ${isFolded ? "h-8 w-8" : "h-10 w-10"}`}
            >
              <img
                src={user.image}
                alt={`${user.nickname} 프로필 이미지`}
                className="h-full w-full rounded-[12px] object-cover"
              />
            </div>
            <div
              className={`min-w-0 flex-1 flex-col gap-1 text-left transition-opacity ${isFolded ? "pointer-events-none scale-0 opacity-0" : "flex scale-100 opacity-100 duration-200"}`}
            >
              <span className="text-lg-m text-color-primary block max-w-full truncate">
                {user.nickname}
              </span>
              <span className="text-md-m text-color-disabled block max-w-full truncate">
                {teamName}
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
