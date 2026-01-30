import { Link } from "react-router-dom";
import UserProfileMobile from "@/assets/user-mobile.svg";
import UserProfile from "@/assets/user.svg";
import { useGnbStore } from "../useGnbStore";

interface User {
  id: number;
  name: string;
  team: string;
  profileUrl: string;
}

type UserProfileProps = {
  user?: User | null;
};
export default function GnbUserProfile({ user }: UserProfileProps) {
  const isFolded = useGnbStore((state) => state.isFolded);
  user = {
    id: 1,
    name: "홍길동",
    team: "개발팀",
    profileUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  };

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
                src={user.profileUrl}
                alt={`${user.name} 프로필 이미지`}
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
                src={user.profileUrl}
                alt={`${user.name} 프로필 이미지`}
                className="h-full w-full rounded-[12px] object-cover"
              />
            </div>
            <div
              className={`flex flex-col gap-1 text-left transition-opacity ${isFolded ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100 duration-200"}`}
            >
              <span className="text-lg-m text-color-primary block truncate">
                {user.name}
              </span>
              <span className="text-md-m text-color-disabled block truncate">
                {user.team}
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
