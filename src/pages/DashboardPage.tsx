
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomCard } from "@/components/layout/RoomCard";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getUserRooms, getRoomByCode, joinRoom } from "@/services/api";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Fetch user's active rooms
  const { 
    data: activeRooms = [], 
    isLoading: isLoadingActive,
    error: activeError
  } = useQuery({
    queryKey: ['active-rooms'],
    queryFn: () => getUserRooms('active')
  });

  // Fetch user's recent rooms
  const { 
    data: recentRooms = [], 
    isLoading: isLoadingRecent 
  } = useQuery({
    queryKey: ['recent-rooms'],
    queryFn: () => getUserRooms('recent')
  });

  const handleJoinRoom = async () => {
    if (roomCode.length !== 6) {
      toast({
        title: "Invalid room code",
        description: "Please enter a valid 6-character room code",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      // Check if room exists
      const room = await getRoomByCode(roomCode);
      
      if (!room) {
        toast({
          title: "Room not found",
          description: "No room exists with that code. Please check and try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Join the room
      await joinRoom(room.id);
      
      // Navigate to room
      navigate(`/room/${room.id}`);
      
      toast({
        title: "Room joined!",
        description: `You've successfully joined ${room.name}`,
      });
      
    } catch (error: any) {
      toast({
        title: "Could not join room",
        description: error.message || "An error occurred while joining the room",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoadingActive || isLoadingRecent) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your rooms...</p>
      </div>
    );
  }

  if (activeError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error loading rooms</h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!</h1>
          <p className="text-muted-foreground">Ready to make some decisions today?</p>
        </div>
        <Link to="/create-room">
          <Button className="w-full sm:w-auto">
            Create New Room
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-bold mb-4">Join a Room</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="roomCode" className="sr-only">
              Room Code
            </Label>
            <Input
              id="roomCode"
              placeholder="Enter 6-digit room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full"
              maxLength={6}
            />
          </div>
          <Button 
            onClick={handleJoinRoom} 
            disabled={roomCode.length !== 6 || isJoining}
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

      <div>
        <h2 className="text-xl font-bold mb-4">My Active Rooms</h2>
        {activeRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                id={room.id}
                name={room.name}
                description={room.description || ''}
                createdBy={user?.user_metadata?.full_name || 'You'}
                participants={[]}
                active={room.phase !== 'results'}
                type={room.type as "dice" | "spinner" | "coin"}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 border flex flex-col items-center justify-center text-center py-12">
            <div className="rounded-full bg-primary-50 p-4 mb-4">
              <Plus size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No active rooms</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You don't have any active decision rooms. Create one to get started!
            </p>
            <Link to="/create-room">
              <Button>Create Your First Room</Button>
            </Link>
          </div>
        )}
      </div>

      {recentRooms.length > 0 && (
        <div>
          <Separator className="my-8" />
          <h2 className="text-xl font-bold mb-4">Recent Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                id={room.id}
                name={room.name}
                description={room.description || ''}
                createdBy={user?.user_metadata?.full_name || 'You'}
                participants={[]}
                active={false}
                type={room.type as "dice" | "spinner" | "coin"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
