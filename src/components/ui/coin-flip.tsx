
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CoinFlipProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onFlip?: (result: "heads" | "tails") => void;
}

export function CoinFlip({ className, size = "md", onFlip }: CoinFlipProps) {
  const [flipping, setFlipping] = useState(false);
  const [isHeads, setIsHeads] = useState(true);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const handleFlip = () => {
    if (flipping) return;

    setFlipping(true);
    
    // Random result
    const result = Math.random() > 0.5 ? "heads" : "tails";
    
    // Animation time
    setTimeout(() => {
      setIsHeads(result === "heads");
      setFlipping(false);
      if (onFlip) onFlip(result);
    }, 1500);
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer", 
        sizeClasses[size], 
        className
      )}
      onClick={handleFlip}
    >
      <div 
        className={cn(
          "coin absolute inset-0", 
          flipping ? "animate-spin-slow" : "animate-float",
          isHeads ? "" : "rotate-y-180"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-dicey-yellow-dark to-dicey-yellow flex items-center justify-center backface-hidden">
          <span className="font-bold text-dicey-purple text-sm">H</span>
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-dicey-purple-dark to-dicey-purple flex items-center justify-center backface-hidden" style={{ transform: "rotateY(180deg)" }}>
          <span className="font-bold text-dicey-yellow text-sm">T</span>
        </div>
      </div>
    </div>
  );
}
