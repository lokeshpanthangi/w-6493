
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Dice3DProps {
  onRoll?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoRoll?: boolean;
}

export function Dice3D({ onRoll, size = "md", className, autoRoll = false }: Dice3DProps) {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState(1);
  
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
    const newValue = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setValue(newValue);
      setRolling(false);
      if (onRoll) onRoll(newValue);
    }, 1200);
  };

  return (
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
  );
}
