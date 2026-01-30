import {
  mobileMenuItems,
  menuSlideDownProps,
  type MobileMenuItem,
} from "../utils/menuSlideDown";
import TeamListItem from "../shared/TeamListItem";

interface MobileTeamSelectorProps {
  isMenuOpen: boolean;
  selectedItem: number | "board" | null;
  onSelectItem: (item: number) => void;
}

export default function MobileTeamSelector({
  isMenuOpen,
  selectedItem,
  onSelectItem,
}: MobileTeamSelectorProps) {
  const teamItems = mobileMenuItems.filter(
    (item): item is Extract<MobileMenuItem, { type: "team" }> =>
      item.type === "team",
  );

  return (
    <ul className="mb-2 min-w-0 space-y-2 overflow-hidden">
      {teamItems.map((item, index) => {
        const isSelected = selectedItem === item.data.id;
        const animationProps = menuSlideDownProps(index, isMenuOpen);

        return (
          <li
            key={item.data.id}
            className={animationProps.className}
            style={animationProps.style}
          >
            <TeamListItem
              name={item.data.name}
              isSelected={isSelected}
              onClick={() => onSelectItem(item.data.id)}
            />
          </li>
        );
      })}
    </ul>
  );
}
