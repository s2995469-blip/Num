/**
 * Static art-directed hero used when WebGL is unavailable, on low-power
 * devices, and as the base layer while the live scene loads. Pure SVG/CSS,
 * server-rendered, so the hero is never blank.
 */
export function HeroFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-espresso">
      {/* Warm atmospheric glow behind the arch */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_68%_52%,rgba(220,193,139,0.22),transparent_70%)] max-lg:bg-[radial-gradient(80%_40%_at_50%_30%,rgba(220,193,139,0.22),transparent_70%)]" />
      <svg
        className="absolute bottom-0 right-[-8%] h-full w-[78%] max-lg:inset-x-0 max-lg:top-0 max-lg:bottom-auto max-lg:right-auto max-lg:h-[64%] max-lg:w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="hf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1712" />
            <stop offset="0.55" stopColor="#6b5236" />
            <stop offset="0.72" stopColor="#c99d62" />
            <stop offset="0.76" stopColor="#f0cf96" />
          </linearGradient>
          <radialGradient id="hf-sun" cx="0.5" cy="0.72" r="0.35">
            <stop offset="0" stopColor="#ffe3b3" stopOpacity="0.95" />
            <stop offset="1" stopColor="#f0cf96" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hf-sphere" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#f7f1e5" />
            <stop offset="0.55" stopColor="#d9cbb2" />
            <stop offset="1" stopColor="#6d5d48" />
          </radialGradient>
          <linearGradient id="hf-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2f22" />
            <stop offset="0.25" stopColor="#1a1814" />
            <stop offset="1" stopColor="#141310" />
          </linearGradient>
          <linearGradient id="hf-reflect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0cf96" stopOpacity="0.35" />
            <stop offset="1" stopColor="#f0cf96" stopOpacity="0" />
          </linearGradient>
          <clipPath id="hf-opening">
            <path d="M380 760 V430 A120 120 0 0 1 620 430 V760 Z" />
          </clipPath>
        </defs>

        {/* Distant view through the opening */}
        <g clipPath="url(#hf-opening)">
          <rect x="300" y="250" width="400" height="520" fill="url(#hf-sky)" />
          <rect x="300" y="250" width="400" height="520" fill="url(#hf-sun)" />
          <path d="M300 742 Q360 726 420 736 T540 730 T700 738 V770 H300 Z" fill="#4e3f2e" />
          <path d="M300 752 Q380 744 460 750 T620 746 T700 752 V770 H300 Z" fill="#1e1b17" />
        </g>

        {/* Arch: straight jambs, semicircular head — as in the logo */}
        <path
          d="M300 760 V430 A200 200 0 0 1 700 430 V760 H620 V430 A120 120 0 0 0 380 430 V760 Z"
          fill="#8c8170"
        />
        <path d="M300 760 V430 A200 200 0 0 1 700 430" fill="none" stroke="#dcc18b" strokeOpacity="0.35" strokeWidth="1.5" />

        {/* Water with the warm opening reflected */}
        <rect x="0" y="760" width="1000" height="240" fill="url(#hf-water)" />
        <rect x="380" y="760" width="240" height="150" fill="url(#hf-reflect)" />

        {/* Plinth */}
        <path d="M410 748 h180 l8 32 h-196 Z" fill="#201e1a" />
        <ellipse cx="500" cy="782" rx="150" ry="9" fill="#26231e" />

        {/* Orbits behind */}
        <g fill="none" stroke="#b4935a" strokeWidth="1.4" strokeOpacity="0.9">
          <ellipse cx="500" cy="650" rx="190" ry="44" transform="rotate(-12 500 650)" strokeDasharray="900 300" />
        </g>

        {/* Carved sphere */}
        <circle cx="500" cy="650" r="98" fill="url(#hf-sphere)" />
        <circle cx="500" cy="650" r="98" fill="none" stroke="#f0cf96" strokeOpacity="0.35" strokeWidth="2" />
        <text
          x="500"
          y="684"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="104"
          fill="#a48d68"
          fillOpacity="0.85"
        >
          7
        </text>
        <circle cx="500" cy="650" r="62" fill="none" stroke="#b49f7c" strokeOpacity="0.6" strokeWidth="1.2" />

        {/* Orbit in front + beads */}
        <g fill="none" stroke="#b4935a" strokeWidth="1.4">
          <path d="M318 690 A190 44 -12 0 0 690 612" />
          <path d="M360 560 A150 150 0 0 1 652 584" strokeOpacity="0.55" />
        </g>
        <circle cx="690" cy="612" r="6" fill="#b4935a" />
        <circle cx="372" cy="552" r="8" fill="#efe7d8" />

        {/* A few still motes */}
        <g fill="#dcc18b">
          <circle cx="420" cy="380" r="1.6" opacity="0.6" />
          <circle cx="610" cy="330" r="1.2" opacity="0.5" />
          <circle cx="720" cy="520" r="1.4" opacity="0.4" />
          <circle cx="260" cy="610" r="1.2" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
