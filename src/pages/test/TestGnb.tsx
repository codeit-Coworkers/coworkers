import Gnb from "@/components/gnb/Gnb";
import { useGnbStore } from "@/components/gnb/useGnbStore";

export default function TestGnb() {
  const { isFolded, toggleFolded, selectedItem } = useGnbStore();

  return (
    <div className="flex h-screen">
      <Gnb />

      <main className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          GNB 테스트 페이지
        </h1>

        <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            현재 상태
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Folded:</span>{" "}
              <span
                className={`rounded px-2 py-1 ${isFolded ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
              >
                {isFolded ? "접힘" : "펼침"}
              </span>
            </p>
            <p>
              <span className="font-medium">선택된 항목:</span>{" "}
              <span className="rounded bg-gray-100 px-2 py-1 text-gray-600">
                {selectedItem ?? "없음"}
              </span>
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            GNB 기능 목록
          </h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
            <li>반응형 지원 (모바일/데스크탑 자동 전환)</li>
            <li>데스크탑에서 사이드바 접기/펼치기</li>
            <li>팀 선택 및 할 일 목록 네비게이션</li>
            <li>사용자 프로필 영역</li>
            <li>팀 추가 기능</li>
          </ul>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            테스트 컨트롤
          </h2>
          <button
            type="button"
            onClick={toggleFolded}
            className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
          >
            사이드바 {isFolded ? "펼치기" : "접기"}
          </button>
        </section>
      </main>
    </div>
  );
}
