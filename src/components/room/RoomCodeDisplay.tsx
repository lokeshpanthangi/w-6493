
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomCodeDisplayProps {
  code: string;
  onCopy?: () => void;
}

export function RoomCodeDisplay({ code, onCopy }: RoomCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCopy) onCopy();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-muted rounded-lg p-4 w-full flex flex-col items-center justify-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">ROOM CODE</p>
        <div className="flex justify-center items-center gap-2">
          <div className="flex gap-2">
            {code.split("").map((char, i) => (
              <div 
                key={i} 
                className="inline-flex items-center justify-center w-12 h-14 rounded-md bg-background border text-2xl font-bold"
              >
                {char}
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleCopy}
            className="ml-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
