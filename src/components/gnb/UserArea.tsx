import Logo from "@/assets/logo.svg";
import LogoMobile from "@/assets/logo-mobile.svg";
import GnbMenu from "@/assets/gnb-menu.svg";
import { Link } from "react-router-dom";
import GnbUserProfile from "./GnbUserProfile";

type UserAreaProps = {
  onMenuOpen: (isOpen: boolean) => void;
};

export default function UserArea({ onMenuOpen }: UserAreaProps) {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="모바일 메뉴 열기"
            className="md:hidden"
            onClick={() => onMenuOpen(true)}
          >
            <GnbMenu className="h-[24px] w-[24px]" />
          </button>
          <Link to="/" aria-label="홈으로 이동">
            <LogoMobile className="h-[24px] w-[24px] md:hidden" />
            <Logo className="hidden aspect-[158/32] w-[102px] md:block md:w-[158px]" />
          </Link>
        </div>
        <div className="md:hidden">
          <GnbUserProfile />
        </div>
      </div>
    </div>
  );
}
