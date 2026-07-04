export function LogoMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M10 38 L26 20 L50 14 L74 20 L90 38" />
      <path d="M10 38 L26 46 L50 40 L74 46 L90 38" />
      <path d="M26 20 L26 46" />
      <path d="M74 20 L74 46" />
      <path d="M26 46 L34 66 L42 78 L50 84 L58 78 L66 66 L74 46" />
      <path d="M50 40 L50 84" />
      <path d="M34 66 L50 58 L66 66" />
      <path d="M42 78 L50 58 L58 78" />
      <path d="M10 38 L4 46 L10 52" />
      <path d="M90 38 L96 46 L90 52" />
    </svg>
  );
}

export function LogoLockup({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ color }}>
      <LogoMark className="h-9 w-9 shrink-0" color={color} />
      <span className="font-display font-extrabold tracking-[0.14em] text-sm sm:text-base uppercase leading-tight">
        Tepson<span className="font-normal">&apos;s</span> Art
        <span className="block text-[0.6em] font-semibold tracking-[0.3em] opacity-80">
          Group
        </span>
      </span>
    </div>
  );
}
