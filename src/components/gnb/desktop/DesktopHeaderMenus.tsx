import DesktopTeamSelector from "./DesktopTeamSelector";
import AddTeamButton from "../shared/AddTeamButton";
import DesktopNavLinks from "./DesktopNavLinks";

// 임시 상태 관리 훅
import { useSelectedLink } from "../useSelectedLink";

interface DesktopHeaderMenusProps {
  isFolded: boolean;
}

export default function DesktopHeaderMenus({
  isFolded,
}: DesktopHeaderMenusProps) {
  const { selectedItem, setSelectedItem } = useSelectedLink();

  const selectedBoard = selectedItem === "board";

  return (
    <div>
      <DesktopTeamSelector
        isFolded={isFolded}
        selectedItem={selectedItem}
        onSelectItem={(id) => setSelectedItem(id)}
      />
      <div className={isFolded ? "mt-2 px-2" : "px-4"}>
        <AddTeamButton size="sm" />
      </div>
      <DesktopNavLinks
        isFolded={isFolded}
        isSelected={selectedBoard}
        onSelect={() => setSelectedItem("board")}
      />
    </div>
  );
}
