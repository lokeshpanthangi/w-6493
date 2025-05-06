
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SpinnerWheelProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  options?: string[];
  onSpin?: (result: string) => void;
}

export function SpinnerWheel({ 
  className, 
  size = "md", 
  options = ["A", "B", "C", "D", "E", "F"], 
  onSpin 
}: SpinnerWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    
    // Random rotation between 720 and 1800 degrees (2-5 full spins)
    const newRotation = rotation + 720 + Math.random() * 1080;
    
    setRotation(newRotation);
    
    // Calculate the result based on the final rotation
    setTimeout(() => {
      const normalizedRotation = newRotation % 360;
      const segmentSize = 360 / options.length;
      const resultIndex = Math.floor(normalizedRotation / segmentSize);
      const result = options[resultIndex];
      
      setSpinning(false);
      if (onSpin) onSpin(result);
    }, 3000);
  };

  return (
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
          return (
            <div
              key={index}
              className="absolute top-0 left-0 w-full h-full flex justify-center"
              style={{
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div 
                className="h-1/2 w-0.5 bg-white opacity-70"
              ></div>
              <div 
                className="absolute top-4 text-white font-bold text-xs"
                style={{
                  transform: `rotate(${-angle}deg)`,
                }}
              >
                {option}
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
  );
}
