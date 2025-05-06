
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Dice3D } from "@/components/ui/dice-3d";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roomCode: urlRoomCode } = useParams<{ roomCode?: string }>();
  
  const [roomCode, setRoomCode] = useState(urlRoomCode || "");
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<{
    name: string;
    createdBy: string;
    participants: number;
    type: "dice" | "coin" | "spinner";
  } | null>(null);

  const handleCheckRoom = () => {
    if (roomCode.length !== 6) {
      toast({
        title: "Invalid room code",
        description: "Please enter a valid 6-character room code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Mock API call to get room details
    setTimeout(() => {
      // Mock success response
      setRoomDetails({
        name: "Movie Night Decision",
        createdBy: "Alex",
        participants: 3,
        type: "dice",
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinRoom = () => {
    setIsJoining(true);

    // Mock joining room
    setTimeout(() => {
      toast({
        title: "Room joined!",
        description: "You've successfully joined the decision room",
      });

      // Navigate to the room page
      navigate(`/room/${roomCode}`);
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Join a Decision Room</h1>
        <p className="text-muted-foreground">
          Enter a 6-character room code to join a decision
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Room Code</CardTitle>
          <CardDescription>
            Type the 6-letter code provided by the room creator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-code">Room Code</Label>
            <InputOTP
              maxLength={6}
              value={roomCode}
              onChange={(value) => setRoomCode(value.toUpperCase())}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          {!roomDetails ? (
            <Button 
              className="w-full" 
              onClick={handleCheckRoom}
              disabled={roomCode.length !== 6 || isLoading}
            >
              {isLoading ? "Checking Code..." : "Check Room"}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{roomDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">Created by {roomDetails.createdBy}</p>
                  </div>
                  <Dice3D size="sm" />
                </div>
                <div className="text-sm">
                  <p>{roomDetails.participants} participants already in room</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setRoomDetails(null);
                    setRoomCode("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleJoinRoom}
                  disabled={isJoining}
                >
                  {isJoining ? "Joining..." : "Join Room"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-center text-muted-foreground">
        Don't have a code? Ask the room creator to share it with you, or{" "}
        <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/create-room")}>
          create your own room
        </Button>
      </p>
    </div>
  );
}
