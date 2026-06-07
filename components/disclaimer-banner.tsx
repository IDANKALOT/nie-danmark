import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const DISCLAIMER_TEXT =
  "Vi er en privat virksomhed og er ikke en offentlig myndighed eller en del af den spanske regering. Vi hjælper kunder med administration og koordinering af ansøgningsprocessen.";

interface DisclaimerBannerProps {
  variant?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Legal disclaimer required on key customer-facing surfaces, clarifying
 * that NIE Danmark is a private service provider, not a government body.
 */
export function DisclaimerBanner({
  variant = "light",
  size = "md",
  className,
}: DisclaimerBannerProps) {
  const isDark = variant === "dark";
  const isSmall = size === "sm";

  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border",
        isSmall ? "p-3.5" : "p-5",
        className
      )}
      style={{
        background: isDark ? "rgba(212,175,55,0.08)" : "#f8fafc",
        borderColor: isDark ? "rgba(212,175,55,0.25)" : "#e2e8f0",
      }}
    >
      <ShieldAlert
        size={isSmall ? 16 : 18}
        className="flex-shrink-0 mt-0.5"
        style={{ color: "#d4af37" }}
      />
      <p
        className={cn(isSmall ? "text-xs" : "text-sm", "leading-relaxed")}
        style={{ color: isDark ? "rgba(255,255,255,0.65)" : "#475569" }}
      >
        <span className="font-semibold" style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
          Vigtig oplysning:{" "}
        </span>
        {DISCLAIMER_TEXT}
      </p>
    </div>
  );
}
