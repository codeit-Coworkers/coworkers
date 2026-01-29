import { useState } from "react";
import GnbFooter from "./GnbFooter";
import NavLinks from "./NavLinks";
import TeamSelector from "./TeamSelector";
import UserArea from "./UserArea";
import GnbMobileMenu from "./GnbMobileMenu";

export default function Gnb() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="w-full md:w-[270px] md:shrink-0">
        {/* <GnbHeader /> */}
        <UserArea onMenuOpen={setIsMobileMenuOpen} />
        <GnbMobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <TeamSelector />
        <NavLinks />
        <GnbFooter className="hidden md:block" />
      </header>
    </div>
  );
}
