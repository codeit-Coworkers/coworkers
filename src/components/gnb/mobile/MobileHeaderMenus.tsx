import { useState } from "react";
import Close from "@/assets/close.svg";
import MobileTeamSelector from "./MobileTeamSelector";
import AddTeamButton from "../shared/AddTeamButton";
import MobileNavLinks from "./MobileNavLinks";
import {
  ITEM_DELAY,
  getItemIndex,
  menuSlideDownProps,
} from "../utils/menuSlideDown";

interface MobileHeaderMenusProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileHeaderMenus({
  isOpen,
  onClose,
}: MobileHeaderMenusProps) {
  const [selectedItem, setSelectedItem] = useState<number | "board" | null>(
    null,
  );
  const selectedBoard = selectedItem === "board";

  const addTeamAnimationProps = menuSlideDownProps(
    getItemIndex("addTeamButton"),
    isOpen,
  );

  return (
    <div
      className={`bg-background-primary fixed top-0 z-50 h-screen w-full transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative px-[16px] py-[68px]">
        <div className="px-0 py-6">
          <MobileTeamSelector
            isMenuOpen={isOpen}
            selectedItem={selectedItem}
            onSelectItem={(id) => setSelectedItem(id)}
          />
          <AddTeamButton
            size="md"
            className={addTeamAnimationProps.className}
            style={addTeamAnimationProps.style}
          />
        </div>
        <MobileNavLinks
          isMenuOpen={isOpen}
          animationDelay={getItemIndex("navLinks") * ITEM_DELAY}
          isSelected={selectedBoard}
          onSelect={() => setSelectedItem("board")}
        />

        <button
          type="button"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <Close />
        </button>
      </div>
    </div>
  );
}
