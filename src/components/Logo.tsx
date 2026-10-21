export function Logo() {
  return (
    <>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#1f4fd8" />
        <path d="M9 22V12l7-4 7 4v10" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="16" cy="17" r="2.6" fill="#14b88a" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-marca-900">Info Site</span>
    </>
  );
}
