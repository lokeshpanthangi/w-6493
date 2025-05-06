
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";

// Mock decision history data
const pastDecisions = [
  {
    id: "decision-1",
    roomName: "Tonight's Dinner Pick",
    decidedOn: "2023-05-05T18:30:00Z",
    participants: ["Alex", "Morgan", "Taylor"],
    options: ["Italian", "Sushi", "Mexican", "Thai", "Burgers"],
    winner: "Sushi",
    method: "dice",
  },
  {
    id: "decision-2",
    roomName: "Movie Night",
    decidedOn: "2023-05-03T20:00:00Z",
    participants: ["Alex", "Morgan", "Jordan", "Riley"],
    options: ["The Matrix", "Inception", "Interstellar"],
    winner: "Inception",
    method: "spinner",
  },
  {
    id: "decision-3",
    roomName: "Weekend Activity",
    decidedOn: "2023-04-29T10:15:00Z",
    participants: ["Alex", "Taylor"],
    options: ["Hiking", "Museum"],
    winner: "Hiking",
    method: "coin",
  },
  {
    id: "decision-4",
    roomName: "Team Lunch",
    decidedOn: "2023-04-27T12:00:00Z",
    participants: ["Alex", "Morgan", "Taylor", "Jordan", "Casey"],
    options: ["Pizza", "Salad", "Sandwiches", "Sushi"],
    winner: "Sandwiches",
    method: "dice",
  },
];

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredDecisions = pastDecisions.filter(
    (decision) =>
      decision.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decision.winner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDecisionMethod = (method: string) => {
    switch (method) {
      case "dice":
        return <Dice3D size="sm" />;
      case "coin":
        return <CoinFlip size="sm" />;
      case "spinner":
        return <div className="spinner-wheel w-6 h-6"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Past Decisions</h1>
        <p className="text-muted-foreground">Review your group's decision history</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search decisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="created">Created by Me</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredDecisions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDecisions.map((decision) => (
            <Card key={decision.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{decision.roomName}</CardTitle>
                    <CardDescription>
                      Decided on {formatDate(decision.decidedOn)}
                    </CardDescription>
                  </div>
                  <div>{renderDecisionMethod(decision.method)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Result</h4>
                    <div className="flex items-center gap-2">
                      <div className="bg-dicey-purple text-white font-medium px-4 py-1 rounded-full">
                        {decision.winner}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">All Options</h4>
                    <div className="flex flex-wrap gap-2">
                      {decision.options.map((option) => (
                        <div
                          key={option}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            option === decision.winner
                              ? "bg-dicey-purple text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 pt-2 pb-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>With:</span>
                  <div className="flex -space-x-2">
                    {decision.participants.slice(0, 3).map((participant, i) => (
                      <UserAvatar
                        key={`${decision.id}-${participant}-${i}`}
                        name={participant}
                        size="xs"
                      />
                    ))}
                    {decision.participants.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        +{decision.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border">
          <h3 className="text-xl font-medium mb-2">No decisions found</h3>
          {searchTerm ? (
            <p className="text-muted-foreground mb-4">
              No results match your search term. Try something else?
            </p>
          ) : (
            <p className="text-muted-foreground mb-4">
              You haven't made any decisions yet. Create a room to get started!
            </p>
          )}
          <Button>Create a Room</Button>
        </div>
      )}
    </div>
  );
}
