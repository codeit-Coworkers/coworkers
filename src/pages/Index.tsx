import LogoCoworkers from "@/assets/landing/logo_coworkers.svg";
import LandingSec1Pc from "@/assets/landing/sec1_pc.svg";
import LandingSec1Tab from "@/assets/landing/sec1_tablet.svg";
import LandingSec1Mo from "@/assets/landing/sec1_mobile.svg";
import FolderFill from "@/assets/landing/Folder_fill.svg";
import LandingSec2Pc from "@/assets/landing/sec2_pc.svg";
import LandingSec2Tab from "@/assets/landing/sec2_tablet.svg";
import LandingSec2Mo from "@/assets/landing/sec2_mobile.svg";
import { ThreeButton } from "./ThreeButton";

export default function Index() {
  return (
    <main className="relative">
      <div className="pointer-events-none sticky top-[73vh] z-50 float-right mr-4">
        <div className="pointer-events-auto">
          <ThreeButton />
        </div>
      </div>
      <section className="bg-background-secondary w-full">
        <div className="mb-[19px] ml-[20px] h-[91px] w-[224px]">
          <LogoCoworkers className="h-9 w-9 shrink-0" />
          <div className="pl-[19px]">
            <p className="text-md-m text-gray-400">
              함께 만들어 가는 To do list
            </p>
            <p className="text-brand-primary text-[28px] leading-tight font-bold">
              Coworkers
            </p>
          </div>
        </div>
        <div className="h-[586px] w-[375px] overflow-hidden">
          <LandingSec1Pc className="hidden lg:block" />
          <LandingSec1Tab className="hidden md:block lg:hidden" />
          <LandingSec1Mo className="h-full w-full md:hidden" />
        </div>
      </section>
      <section className="bg-icon-inverse relative w-full pt-10">
        <div className="mb-6 ml-[35px] flex flex-col">
          <FolderFill />
          <p className="text-lg-b text-brand-primary">
            칸반보드로 함께
            <br />할 일 목록을 관리해요
          </p>
          <p className="text-xs-r text-gray-400">
            팀원과 함께 실시간으로 할 일을 추가하고
            <br />
            지금 무엇을 해야 하는지 한눈에 볼 수 있어요
          </p>
        </div>

        <div className="ml-[35px] w-[340px]">
          <LandingSec2Pc className="hidden lg:block" />
          <LandingSec2Tab className="hidden md:block lg:hidden" />
          <LandingSec2Mo className="h-full w-full md:hidden" />
        </div>

        {/* ✅ 여기에 버튼이 도착함 (공간 확보용) */}
        <div className="flex h-[100px] justify-end pr-4 pb-[44px]">
          {/* 이미 위에서 sticky로 따라오고 있으므로, 
              이 구역은 스크롤 끝 지점을 표시하는 역할을 합니다. */}
        </div>
      </section>
    </main>
  );
}
