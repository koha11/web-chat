import React from "react";

/**
 * ProgressDonutSquare — simple square with gray background and a two-ring donut:
 * - Base ring: full WHITE circle (track)
 * - Progress ring: GRAY arc drawn over the base, proportional to `progress` (0..100)
 * - No spinning — the arc length reflects progress directly
 */
export default function ProgressDonutSquare({
  progress,
  size = 96, // px
  className = "",
  bgClass = "bg-gray-300", // square background
  rounded = "rounded-xl",
  trackColor = "#ffffff", // white base ring
  progressColor = "#9ca3af", // gray progress ring (Tailwind gray-400)
  strokeWidth = 6,
}: {
  progress: number; // 0..100
  size?: number;
  className?: string;
  bgClass?: string;
  rounded?: string;
  trackColor?: string;
  progressColor?: string;
  strokeWidth?: number;
}) {
  const pct = Math.max(0, Math.min(100, progress));

  // Donut geometry
  const r = 18; // radius
  const c = 2 * Math.PI * r; // circumference
  const dashArray = c;
  const dashOffset = ((100 - pct) / 100) * c; // 100% -> 0, 0% -> c

  const svgSize = Math.round(size * 0.55); // size of the donut relative to square

  return (
    <div
      className={["grid place-items-center", bgClass, rounded, className].join(
        " "
      )}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Loading progress"
    >
      <svg viewBox="0 0 48 48" width={svgSize} height={svgSize}>
        {/* Rotate -90deg so progress starts at 12 o'clock */}
        <g transform="rotate(-90 24 24)">
          {/* Base white track */}
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Gray progress arc */}
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 180ms linear" }}
          />
        </g>
      </svg>
    </div>
  );
}
