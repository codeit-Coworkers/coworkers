export default function NavLinks({
  isMobileMenuOpen,
  animationDelay = 0,
}: {
  isMobileMenuOpen?: boolean;
  animationDelay?: number;
}) {
  return (
    <div
      className={`opacity-0 ${
        isMobileMenuOpen
          ? "animate-[fadeDown_0.5s_ease-out_forwards] opacity-0"
          : ""
      }`}
      style={isMobileMenuOpen ? { animationDelay: `${animationDelay}ms` } : {}}
    >
      <div>NavLinks</div>
    </div>
  );
}
