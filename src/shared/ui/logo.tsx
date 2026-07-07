import Image from "next/image";
import { cn } from "@/shared/utils/cn";

interface LogoProps {
  className?: string;
  variant?: "lockup" | "wordmark" | "mark";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  lockup: {
    sm: { className: "h-7 w-[91px]", width: 91, height: 28 },
    md: { className: "h-9 w-[117px]", width: 117, height: 36 },
    lg: { className: "h-12 w-[156px]", width: 156, height: 48 },
  },
  wordmark: {
    sm: { className: "h-7 w-[62px]", width: 62, height: 28 },
    md: { className: "h-9 w-[80px]", width: 80, height: 36 },
    lg: { className: "h-12 w-[106px]", width: 106, height: 48 },
  },
  mark: {
    sm: { className: "h-8 w-8", width: 32, height: 32 },
    md: { className: "h-10 w-10", width: 40, height: 40 },
    lg: { className: "h-14 w-14", width: 56, height: 56 },
  },
};

const sources = {
  lockup: "/brand/xitty-lockup.png",
  wordmark: "/brand/xitty-wordmark.png",
  mark: "/brand/xitty-icon.png",
};

export function Logo({ className, variant = "lockup", size = "md" }: LogoProps) {
  const logoSize = sizes[variant][size];

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)} aria-label="Xitty">
      <Image
        src={sources[variant]}
        alt=""
        aria-hidden="true"
        draggable={false}
        width={logoSize.width}
        height={logoSize.height}
        className={cn(
          "block object-contain",
          logoSize.className,
        )}
        priority
      />
    </span>
  );
}
