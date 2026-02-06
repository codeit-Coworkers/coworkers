import { useIsMobile } from "@/hooks/useMediaQuery";
import ImageIcon from "@/assets/image-icon.svg";

interface ImageUploadProps {
  imageCount?: number;
  maxImages?: number;
}

/**
 * 이미지 업로드 컴포넌트
 *
 * @description
 * 추후 이미지 업로드 로직을 추가할 수 있도록 구조화된 컴포넌트입니다.
 */
export default function ImageUpload({
  imageCount = 0,
  maxImages = 5,
}: ImageUploadProps) {
  const isMobile = useIsMobile();

  // 반응형 스타일
  const labelSize = isMobile ? "text-md-b" : "text-lg-b";
  const labelBottomPadding = isMobile ? "mb-2" : "mb-3";
  const imageBoxSize = isMobile ? "w-20 h-20" : "w-[120px] h-[120px]";
  const iconTextGap = isMobile ? "gap-1" : "gap-4";
  const imageBottomPadding = isMobile ? "mb-12" : "mb-[57px]";

  return (
    <div className={imageBottomPadding}>
      <label
        className={`${labelSize} text-color-primary ${labelBottomPadding} block`}
      >
        이미지
      </label>
      <button
        type="button"
        className={`border-border-primary rounded-xl border ${imageBoxSize} flex flex-col items-center justify-center ${iconTextGap} bg-background-primary hover:bg-background-secondary transition-colors`}
        onClick={() => {
          // TODO: 이미지 업로드 로직 추가
          console.log("이미지 업로드 버튼 클릭");
        }}
      >
        {/* 이미지 아이콘 */}
        <ImageIcon className="text-slate-400" />
        {/* 이미지 개수 */}
        <span className="text-color-default text-sm">
          {imageCount}/{maxImages}
        </span>
      </button>
    </div>
  );
}
