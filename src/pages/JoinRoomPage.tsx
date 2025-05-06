
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";
import { SpinnerWheel } from "@/components/ui/spinner-wheel";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { getRoomByCode, joinRoom } from "@/services/api";

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roomCode: urlRoomCode } = useParams<{ roomCode?: string }>();
  
  const [roomCode, setRoomCode] = useState(urlRoomCode || "");
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomDetails, setRoomDetails] = useState<{
    id: string;
    name: string;
    createdBy: string;
    participants: number;
    type: "dice" | "coin" | "spinner";
  } | null>(null);

  // Check the URL room code automatically
  useEffect(() => {
    if (urlRoomCode && urlRoomCode.length === 6) {
      handleCheckRoom();
    }
  }, [urlRoomCode]);

  const handleCheckRoom = async () => {
    if (roomCode.length !== 6) {
      toast({
        title: "Invalid room code",
        description: "Please enter a valid 6-character room code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const room = await getRoomByCode(roomCode);
      
      if (!room) {
        toast({
          title: "Room not found",
          description: "No room exists with that code. Please check and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get participants count
      const participantsCount = 3; // Mock for now

      // Set room details
      setRoomDetails({
        id: room.id,
        name: room.name,
        createdBy: "Room Creator", // We'll update this with real data later
        participants: participantsCount,
        type: room.type as "dice" | "coin" | "spinner",
      });
      
    } catch (error) {
      toast({
        title: "Error checking room",
        description: "Could not check room details. Please try again.",
        variant: "destructive",
      });
      console.error("Error checking room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomDetails) return;
    
    setIsJoining(true);

    try {
      // Join the room
      await joinRoom(roomDetails.id);
      
      toast({
        title: "Room joined!",
        description: "You've successfully joined the decision room",
      });

      // Navigate to the room page
      navigate(`/room/${roomDetails.id}`);
    } catch (error) {
      toast({
        title: "Failed to join room",
        description: "There was an error joining the room. Please try again.",
        variant: "destructive",
      });
      console.error("Error joining room:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const renderDecisionIcon = () => {
    if (!roomDetails) return null;
    
    switch (roomDetails.type) {
      case "dice":
        return <Dice3D size="sm" />;
      case "coin":
        return <CoinFlip size="sm" />;
      case "spinner":
        return <div className="spinner-wheel w-6 h-6"></div>;
    }
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
              {isLoading ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Checking Code...
                </div>
              ) : (
                "Check Room"
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{roomDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">Created by {roomDetails.createdBy}</p>
                  </div>
                  {renderDecisionIcon()}
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
                  {isJoining ? (
                    <div className="flex items-center">
                      <Spinner size="sm" className="mr-2" />
                      Joining...
                    </div>
                  ) : (
                    "Join Room"
                  )}
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
