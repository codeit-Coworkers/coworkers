import Close from "@/assets/close.svg";
import MobileTeamSelector from "./MobileTeamSelector";
import AddTeamButton from "../shared/AddTeamButton";
import MobileNavLinks from "./MobileNavLinks";
import {
  ITEM_DELAY,
  getMobileMenuItems,
  getItemIndex,
  menuSlideDownProps,
} from "../utils/menuSlideDown";
// 임시 상태 관리 훅
import { useGnbStore } from "../useGnbStore";
import { useGroups } from "@/api/user";
interface MobileHeaderMenusProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileHeaderMenus({
  isOpen,
  onClose,
}: MobileHeaderMenusProps) {
  const { data: groups } = useGroups();
  const menuItems = getMobileMenuItems(groups);

  const { selectedItem, setSelectedItem } = useGnbStore();
  const selectedBoard = selectedItem === "board";

  const addTeamAnimationProps = menuSlideDownProps(
    getItemIndex(menuItems, "addTeamButton"),
    isOpen,
  );

  return (
    <div
      className={`bg-background-primary fixed top-0 z-50 h-screen w-full transition-transform duration-300 ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none z-[-1] -translate-y-full opacity-0"
      }`}
    >
      <div className="relative px-[16px] py-[68px]">
        <div className="px-0 py-6">
          <MobileTeamSelector
            isMenuOpen={isOpen}
            selectedItem={selectedItem}
            onSelectItem={(id) => setSelectedItem(id)}
            groupsData={groups}
          />

          <AddTeamButton
            size="md"
            className={addTeamAnimationProps.className}
            style={addTeamAnimationProps.style}
          />
        </div>
        <MobileNavLinks
          isMenuOpen={isOpen}
          animationDelay={getItemIndex(menuItems, "navLinks") * ITEM_DELAY}
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
