export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`btn-arrow ${className}`}
      width="22"
      height="10"
      viewBox="0 0 22 10"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 5h20M16 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
