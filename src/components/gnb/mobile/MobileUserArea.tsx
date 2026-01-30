import LogoMobile from "@/assets/logo-mobile.svg";
import GnbMenu from "@/assets/gnb-menu.svg";
import { Link } from "react-router-dom";
import GnbUserProfile from "../shared/GnbUserProfile";

interface MobileUserAreaProps {
  onMenuOpen: (isOpen: boolean) => void;
}

export default function MobileUserArea({ onMenuOpen }: MobileUserAreaProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="모바일 메뉴 열기"
            onClick={() => onMenuOpen(true)}
          >
            <GnbMenu className="h-[24px] w-[24px]" />
          </button>
          <Link to="/" aria-label="홈으로 이동">
            <LogoMobile className="h-[24px] w-[24px]" />
          </Link>
        </div>
        <GnbUserProfile />
      </div>
    </div>
  );
}
