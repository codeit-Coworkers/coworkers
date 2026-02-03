/**
 * 자유게시판 페이지
 */
export default function Boards() {
  return (
    <div className="bg-background-primary min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-color-primary mb-6 text-2xl font-bold">
          자유게시판
        </h1>

        {/* 게시글 목록 영역 (추후 구현) */}
        <div className="border-border-primary bg-background-secondary rounded-lg border p-8 text-center">
          <p className="text-color-secondary">게시글이 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
