import { useState } from "react";
import MobileUserArea from "./MobileUserArea";
import MobileHeaderMenus from "./MobileHeaderMenus";

export default function MobileGnb() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-border-primary relative w-full md:border-r md:border-solid">
      <MobileUserArea onMenuOpen={setIsMenuOpen} />
      <MobileHeaderMenus
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
