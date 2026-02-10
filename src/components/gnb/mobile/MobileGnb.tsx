import { useState } from "react";
import MobileUserArea from "./MobileUserArea";
import MobileHeaderMenus from "./MobileHeaderMenus";
import { useAuthStore } from "@/stores/useAuthStore";

export default function MobileGnb() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <header className="border-border-primary relative w-full md:border-r md:border-solid">
        <MobileUserArea onMenuOpen={setIsMenuOpen} />
      </header>
    );
  }

  return (
    <>
      <header className="border-border-primary relative w-full md:border-r md:border-solid">
        <MobileUserArea onMenuOpen={setIsMenuOpen} />
        <MobileHeaderMenus
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />
      </header>
    </>
  );
}
