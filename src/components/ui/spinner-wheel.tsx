
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SpinnerWheelProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  options?: string[];
  onSpin?: (result: string) => void;
  tiebreaker?: boolean;
}

export function SpinnerWheel({ 
  className, 
  size = "md", 
  options = ["A", "B", "C", "D", "E", "F"], 
  onSpin,
  tiebreaker = false
}: SpinnerWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: tiebreaker ? "w-64 h-64" : "w-48 h-48",
  };

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    
    // Random rotation between 720 and 1800 degrees (2-5 full spins)
    const newRotation = rotation + 720 + Math.random() * 1080;
    
    setRotation(newRotation);
    
    // Calculate the result based on the final rotation
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const segmentSize = 360 / options.length;
      const resultIndex = Math.floor(normalizedRotation / segmentSize);
      const resultValue = options[resultIndex];
      
      setResult(resultValue);
      setSpinning(false);
      setSpinCount(prev => prev + 1);
      
      if (onSpin) onSpin(resultValue);
      
      if (tiebreaker) {
        toast({
          title: `The winner is...`,
          description: resultValue,
          className: "bg-green-50 text-green-900 border-green-200",
        });
      }
    }, 3000);
  };

  return (
    <div className={cn("flex flex-col items-center", tiebreaker && "py-6")}>
      <div className={cn("relative", sizeClasses[size], className)}>
        <div 
          className="w-full h-full rounded-full bg-gradient-to-tr from-dicey-purple-dark to-dicey-blue relative overflow-hidden shadow-lg cursor-pointer"
          onClick={handleSpin}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none"
          }}
        >
          {options.map((option, index) => {
            const angle = (360 / options.length) * index;
            const segmentColor = index % 2 === 0 
              ? "bg-dicey-purple-dark" 
              : "bg-dicey-purple";
              
            return (
              <div
                key={index}
                className={cn(
                  "absolute top-0 left-0 w-full h-full flex justify-center origin-bottom",
                  segmentColor
                )}
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 0%, 50% 100%, 100% 0%)`,
                }}
              >
                <div 
                  className="absolute top-1/4 text-white font-bold text-xs sm:text-sm rotate-180"
                  style={{
                    transform: `rotate(${180 - angle}deg)`,
                    maxWidth: "80%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tiebreaker ? 
                    (option.length > 10 ? option.substring(0, 10) + "..." : option) : 
                    option
                  }
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Center of wheel */}
        <div className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dicey-yellow z-10 shadow-md"></div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-6 bg-dicey-yellow z-20 clip-triangle shadow-md"></div>
      </div>
      
      {tiebreaker && (
        <>
          <div className={cn(
            "mt-8 text-center transition-all duration-500",
            result && spinCount > 0 ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <div className="text-sm font-medium text-muted-foreground">The wheel has chosen</div>
            <div className="text-2xl font-bold text-dicey-purple mt-1">{result}</div>
          </div>
          
          <div className="mt-6 w-full">
            {spinCount > 0 ? (
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleSpin} 
                  className="px-4 py-2 bg-muted rounded text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  Spin Again
                </button>
              </div>
            ) : (
              <button
                onClick={handleSpin} 
                className="w-full py-3 bg-dicey-purple text-white rounded-md font-medium hover:bg-dicey-purple/90 transition-colors"
              >
                Spin Wheel to Break Tie
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
