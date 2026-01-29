import GnbUserProfile from "./GnbUserProfile";

type GnbFooterProps = {
  className?: string;
  isFolded?: boolean;
};

export default function GnbFooter({ className, isFolded }: GnbFooterProps) {
  return (
    <div className={className}>
      <GnbUserProfile isFolded={isFolded} />
    </div>
  );
}
