import DesktopTeamSelector from "./DesktopTeamSelector";
import AddTeamButton from "../shared/AddTeamButton";
import DesktopNavLinks from "./DesktopNavLinks";
import { useGnbStore } from "../useGnbStore";

export default function DesktopHeaderMenus() {
  const isFolded = useGnbStore((state) => state.isFolded);
  // 임시 상태 관리 훅
  const { selectedItem, setSelectedItem } = useGnbStore();

  const selectedBoard = selectedItem === "board";

  return (
    <div>
      <DesktopTeamSelector
        selectedItem={selectedItem}
        onSelectItem={(id) => setSelectedItem(id)}
      />
      <div className={isFolded ? "hidden" : "mb-6 px-4"}>
        <AddTeamButton size="sm" />
      </div>
      <DesktopNavLinks
        isSelected={selectedBoard}
        onSelect={() => setSelectedItem("board")}
      />
    </div>
  );
}
