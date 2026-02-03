import { useState } from "react";
import MobileUserArea from "./MobileUserArea";
import MobileHeaderMenus from "./MobileHeaderMenus";

export default function MobileGnb() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative w-full border-r border-solid border-[#E2E8F0]">
      <MobileUserArea onMenuOpen={setIsMenuOpen} />
      <MobileHeaderMenus
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
