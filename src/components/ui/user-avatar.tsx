
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "away" | "offline";
  className?: string;
}

export function UserAvatar({
  src,
  name,
  size = "md",
  status,
  className,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10",
    lg: "h-14 w-14 text-lg",
  };

  const statusClasses = {
    online: "bg-green-500",
    away: "bg-amber-500",
    offline: "bg-gray-400",
  };

  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn("ring-2 ring-background", sizeClasses[size])}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-dicey-purple text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-background",
            statusClasses[status],
            size === "xs" || size === "sm" ? "h-2 w-2" : "h-3 w-3"
          )}
        />
      )}
    </div>
  );
}
