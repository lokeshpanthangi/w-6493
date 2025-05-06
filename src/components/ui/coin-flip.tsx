
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface CoinFlipProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onFlip?: (result: "heads" | "tails") => void;
  tiebreaker?: boolean;
  leftOption?: string;
  rightOption?: string;
}

export function CoinFlip({ 
  className, 
  size = "md", 
  onFlip,
  tiebreaker = false,
  leftOption,
  rightOption 
}: CoinFlipProps) {
  const [flipping, setFlipping] = useState(false);
  const [isHeads, setIsHeads] = useState(true);
  const [flipCount, setFlipCount] = useState(0);

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
      setFlipCount(prev => prev + 1);
      
      if (onFlip) onFlip(result);
      
      if (tiebreaker) {
        const winner = result === "heads" ? leftOption : rightOption;
        if (winner) {
          toast({
            title: `The winner is...`,
            description: winner,
            className: "bg-green-50 text-green-900 border-green-200",
          });
        }
      }
    }, 1500);
  };

  return (
    <div className={cn("flex flex-col items-center", tiebreaker && "py-6")}>
      {tiebreaker && (
        <div className="flex justify-between w-full mb-8 px-4">
          <div className={cn(
            "text-center p-3 rounded border transition-all",
            isHeads && flipCount > 0 ? "bg-green-50 border-green-500 scale-110" : "bg-muted border-transparent"
          )}>
            <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Heads</div>
            <div className="font-bold">{leftOption}</div>
          </div>
          <div className="flex items-center font-bold text-muted-foreground">VS</div>
          <div className={cn(
            "text-center p-3 rounded border transition-all",
            !isHeads && flipCount > 0 ? "bg-green-50 border-green-500 scale-110" : "bg-muted border-transparent"
          )}>
            <div className="text-xs uppercase font-bold text-muted-foreground mb-1">Tails</div>
            <div className="font-bold">{rightOption}</div>
          </div>
        </div>
      )}
      
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
      
      {tiebreaker && (
        <div className="mt-6 w-full">
          {flipCount > 0 ? (
            <div className="flex justify-center gap-2">
              <button
                onClick={handleFlip} 
                className="px-4 py-2 bg-muted rounded text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Flip Again
              </button>
            </div>
          ) : (
            <button
              onClick={handleFlip} 
              className="w-full py-3 bg-dicey-purple text-white rounded-md font-medium hover:bg-dicey-purple/90 transition-colors"
            >
              Flip Coin to Break Tie
            </button>
          )}
        </div>
      )}
    </div>
  );
}
