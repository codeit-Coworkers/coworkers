import { menuSlideDownProps } from "../utils/menuSlideDown";
import TeamListItem from "../shared/TeamListItem";
import { GroupSummaryServer } from "@/types/group";

interface MobileTeamSelectorProps {
  isMenuOpen: boolean;
  selectedItem: number | "board" | null;
  onSelectItem: (item: number) => void;
  groupsData?: GroupSummaryServer[];
}

export default function MobileTeamSelector({
  isMenuOpen,
  selectedItem,
  onSelectItem,
  groupsData,
}: MobileTeamSelectorProps) {
  const teamItems =
    groupsData?.map((group) => ({ type: "team" as const, data: group })) || [];

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
