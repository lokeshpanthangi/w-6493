
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoomCard } from "@/components/layout/RoomCard";
import { Separator } from "@/components/ui/separator";

// Mock data
const activeRooms = [
  {
    id: "room-1",
    name: "Tonight's Dinner Pick",
    description: "Let's decide where to eat tonight!",
    createdBy: "Alex",
    participants: [
      { name: "Alex", status: "online" as const },
      { name: "Morgan", status: "online" as const },
      { name: "Taylor", status: "away" as const },
    ],
    active: true,
    type: "dice" as const,
  },
  {
    id: "room-2",
    name: "Weekend Movie Selection",
    description: "Which movie should we watch this weekend?",
    createdBy: "Morgan",
    participants: [
      { name: "Alex", status: "offline" as const },
      { name: "Morgan", status: "online" as const },
      { name: "Taylor", status: "online" as const },
      { name: "Jordan", status: "online" as const },
    ],
    active: true,
    type: "spinner" as const,
  },
];

const recentRooms = [
  {
    id: "room-3",
    name: "Vacation Destination",
    description: "Where should we go for summer vacation?",
    createdBy: "Jordan",
    participants: [
      { name: "Alex", status: "online" as const },
      { name: "Morgan", status: "offline" as const },
      { name: "Taylor", status: "offline" as const },
      { name: "Jordan", status: "online" as const },
      { name: "Riley", status: "away" as const },
      { name: "Casey", status: "offline" as const },
    ],
    active: false,
    type: "spinner" as const,
  },
  {
    id: "room-4",
    name: "Board Game Night",
    description: "Which game should we play first?",
    createdBy: "Taylor",
    participants: [
      { name: "Alex", status: "offline" as const },
      { name: "Taylor", status: "offline" as const },
      { name: "Jordan", status: "offline" as const },
    ],
    active: false,
    type: "coin" as const,
  },
];

export default function DashboardPage() {
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = () => {
    console.log("Joining room with code:", roomCode);
    // In a real app, this would validate the code and join the room
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
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
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full"
              maxLength={6}
            />
          </div>
          <Button onClick={handleJoinRoom} disabled={roomCode.length !== 6}>
            Join Room
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">My Active Rooms</h2>
        {activeRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center border">
            <p className="text-muted-foreground mb-4">
              You don't have any active rooms.
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
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
