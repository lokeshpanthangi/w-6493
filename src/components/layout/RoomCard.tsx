import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";

interface RoomCardProps {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  participants: { name: string; avatar?: string; status?: "online" | "away" | "offline" }[];
  active?: boolean;
  type: "dice" | "coin" | "spinner";
  onJoin?: () => void;
}

export function RoomCard({
  id,
  name,
  description,
  createdBy,
  participants,
  active = false,
  type,
  onJoin,
}: RoomCardProps) {
  return (
    <Card className={`transition-all duration-300 ${active ? "border-dicey-purple" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{name}</CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex justify-center">
            {type === "dice" && <Dice3D size="sm" />}
            {type === "coin" && <CoinFlip size="sm" />}
            {type === "spinner" && (
              <div className="spinner-wheel w-6 h-6 animate-spin-slow"></div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center -space-x-2">
          {participants.slice(0, 5).map((participant, i) => (
            <UserAvatar
              key={`${id}-participant-${i}`}
              name={participant.name}
              src={participant.avatar}
              size="xs"
              status={participant.status}
            />
          ))}
          {participants.length > 5 && (
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground ml-1">
              +{participants.length - 5}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Created by <span className="font-medium">{createdBy}</span>
        </div>
        <Button size="sm" variant={active ? "default" : "outline"} onClick={onJoin}>
          {active ? (onJoin ? "Continue" : "Join") : "View"}
        </Button>
      </CardFooter>
      
      {active && (
        <div className="absolute -top-1 -right-1">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            Active
          </span>
        </div>
      )}
    </Card>
  );
}
