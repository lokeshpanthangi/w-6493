
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Dice3DProps {
  onRoll?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoRoll?: boolean;
  tiebreaker?: boolean;
  options?: string[];
}

export function Dice3D({ 
  onRoll, 
  size = "md", 
  className, 
  autoRoll = false,
  tiebreaker = false,
  options = []
}: Dice3DProps) {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState(1);
  const [rollCount, setRollCount] = useState(0);
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  
  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5", 
  };
  
  useEffect(() => {
    if (autoRoll) {
      handleRoll();
    }
  }, [autoRoll]);

  const handleRoll = () => {
    if (rolling) return;
    
    setRolling(true);
    
    // For tiebreakers, limit the random value to the number of options
    const maxValue = tiebreaker && options.length > 0 
      ? Math.min(options.length, 6) 
      : 6;
      
    const newValue = Math.floor(Math.random() * maxValue) + 1;
    
    setTimeout(() => {
      setValue(newValue);
      setRolling(false);
      setRollCount(prev => prev + 1);
      
      if (onRoll) onRoll(newValue);
      
      if (tiebreaker && options.length > 0) {
        const winningOption = options[newValue - 1];
        if (winningOption) {
          toast({
            title: `The winner is...`,
            description: winningOption,
            className: "bg-green-50 text-green-900 border-green-200",
          });
        }
      }
    }, 1200);
  };

  return (
    <div className={cn("flex flex-col items-center", tiebreaker && "py-6")}>
      {tiebreaker && options.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-8 w-full">
          {options.slice(0, 6).map((option, index) => (
            <div 
              key={index}
              className={cn(
                "text-center p-2 rounded border transition-all",
                value === index + 1 && rollCount > 0 
                  ? "bg-green-50 border-green-500 scale-110" 
                  : "bg-muted border-transparent"
              )}
            >
              <div className="text-xs font-bold text-muted-foreground mb-1">
                {index + 1}
              </div>
              <div className="font-medium text-sm line-clamp-2">{option}</div>
            </div>
          ))}
        </div>
      )}
      
      <div 
        className={cn(
          "dice-3d cursor-pointer dice-shadow", 
          rolling ? "animate-dice-roll" : "animate-float", 
          sizeClasses[size],
          className
        )}
        onClick={handleRoll}
        style={{ perspective: "300px" }}
      >
        <div className={cn("dice-face face-1", sizeClasses[size])}>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
        </div>
        <div className={cn("dice-face face-2", sizeClasses[size])}>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
        </div>
        <div className={cn("dice-face face-3", sizeClasses[size])}>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
        </div>
        <div className={cn("dice-face face-4", sizeClasses[size])}>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
        </div>
        <div className={cn("dice-face face-5", sizeClasses[size])}>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
        </div>
        <div className={cn("dice-face face-6", sizeClasses[size])}>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
          <div className={cn("dice-dot", dotSizeClasses[size])}></div>
        </div>
      </div>
      
      {tiebreaker && (
        <div className="mt-6 w-full">
          {rollCount > 0 ? (
            <div className="flex justify-center gap-2">
              <button
                onClick={handleRoll} 
                className="px-4 py-2 bg-muted rounded text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                Roll Again
              </button>
            </div>
          ) : (
            <button
              onClick={handleRoll} 
              className="w-full py-3 bg-dicey-purple text-white rounded-md font-medium hover:bg-dicey-purple/90 transition-colors"
            >
              Roll Dice to Break Tie
            </button>
          )}
        </div>
      )}
    </div>
  );
}
