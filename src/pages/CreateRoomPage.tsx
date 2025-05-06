
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";
import { SpinnerWheel } from "@/components/ui/spinner-wheel";
import { useToast } from "@/components/ui/use-toast";

interface DecisionTypeOption {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

const decisionTypes: DecisionTypeOption[] = [
  {
    id: "dice",
    name: "Dice Roll",
    description: "Best for selecting from 1-6 options",
    icon: <Dice3D size="sm" />,
  },
  {
    id: "coin",
    name: "Coin Flip",
    description: "Perfect for yes/no decisions between two options",
    icon: <CoinFlip size="sm" />,
  },
  {
    id: "spinner",
    name: "Spinner Wheel",
    description: "Great for many options with weighted probabilities",
    icon: <div className="spinner-wheel w-8 h-8"></div>,
  },
];

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a name for your decision room",
        variant: "destructive",
      });
      return;
    }

    if (!selectedType) {
      toast({
        title: "Decision type required",
        description: "Please select a decision method for your room",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    // Mock room creation - would be replaced with actual API call
    setTimeout(() => {
      toast({
        title: "Room created!",
        description: `Your ${selectedType} decision room is ready.`,
      });
      // Navigate to the new room (In a real app, this would use the actual room ID)
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Create a Decision Room</h1>
        <p className="text-muted-foreground">
          Set up a new room for your group to make a decision together
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomName">Room Name</Label>
          <Input
            id="roomName"
            placeholder="e.g., Dinner Plans, Movie Night, Vacation Destination"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roomDescription">Description (Optional)</Label>
          <Textarea
            id="roomDescription"
            placeholder="What are you deciding on? Add any details for participants."
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Decision Method</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decisionTypes.map((type) => (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all hover:border-dicey-purple ${
                  selectedType === type.id ? "border-2 border-dicey-purple" : ""
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <div>{type.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{type.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button 
          className="w-full mt-6" 
          size="lg"
          onClick={handleCreateRoom}
          disabled={isCreating}
        >
          {isCreating ? "Creating Room..." : "Create Room"}
        </Button>
      </div>
    </div>
  );
}
