import { Link } from "react-router-dom";
import UserProfile from "@/assets/user.svg";

interface User {
  id: number;
  name: string;
  profileUrl: string;
}

type UserProfileProps = {
  user?: User | null;
};
export default function GnbUserProfile({ user }: UserProfileProps) {
  return (
    <div>
      {!user && (
        <Link to="/login" aria-label="로그인 페이지로 이동">
          <UserProfile />
          <span className="hidden md:block">로그인</span>
        </Link>
      )}
      {user && (
        <button type="button" aria-label="유저 프로필 모달 열기 버튼">
          <div className="userProfileBox">
            <img
              src={user.profileUrl}
              alt={`${user.name} 프로필 이미지`}
              width={32}
              height={32}
            />
          </div>
        </button>
      )}
    </div>
  );
}
