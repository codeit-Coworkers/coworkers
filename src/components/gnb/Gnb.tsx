import { useIsMobile } from "@/hooks/useMediaQuery";
import MobileGnb from "./mobile/MobileGnb";
import DesktopGnb from "./desktop/DesktopGnb";

export default function Gnb() {
  const isMobile = useIsMobile();

  if (isMobile) return <MobileGnb />;
  return <DesktopGnb />;
}
