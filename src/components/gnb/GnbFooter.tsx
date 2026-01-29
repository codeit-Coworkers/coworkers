import GnbUserProfile from "./GnbUserProfile";

type GnbFooterProps = {
  className?: string;
};

export default function GnbFooter({ className }: GnbFooterProps) {
  return (
    <div className={className}>
      <GnbUserProfile />
    </div>
  );
}
