import Logo from "../../../public/assets/logo.svg";
import { Link } from "react-router-dom";

export default function GnbHeader() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="홈으로 이동">
            <Logo className="xs:block aspect-[158/32] w-[102px] md:w-[158px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
