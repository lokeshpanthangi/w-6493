
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Spinner } from "@/components/ui/spinner";
import { getUserDecisionsHistory } from "@/services/api";
import type { Room, Decision, Option, Participant } from "@/services/api";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Fetch decision history
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['decisions-history'],
    queryFn: getUserDecisionsHistory
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  const getDecisionWinner = (roomId: string): Option | undefined => {
    if (!data) return undefined;
    
    const decision = data.decisions.find(d => d.room_id === roomId);
    if (!decision || !decision.winning_option_id) return undefined;
    
    return data.options.find(o => o.id === decision.winning_option_id);
  };
  
  const getRoomOptions = (roomId: string): Option[] => {
    if (!data) return [];
    return data.options.filter(o => o.room_id === roomId);
  };
  
  const getRoomParticipants = (roomId: string): Participant[] => {
    if (!data) return [];
    return data.participants.filter(p => p.room_id === roomId);
  };
  
  const filteredDecisions = data?.rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    getDecisionWinner(room.id)?.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your decision history...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error loading history</h2>
        <p className="text-muted-foreground">Please try again later</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

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
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="created">Created by Me</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredDecisions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDecisions.map((room) => {
            const winner = getDecisionWinner(room.id);
            const options = getRoomOptions(room.id);
            const participants = getRoomParticipants(room.id);
            const decision = data?.decisions.find(d => d.room_id === room.id);
            
            return (
              <Card key={room.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{room.name}</CardTitle>
                      <CardDescription>
                        Decided on {formatDate(room.created_at)}
                      </CardDescription>
                    </div>
                    <div>{renderDecisionMethod(room.type)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Result</h4>
                      <div className="flex items-center gap-2">
                        <div className="bg-dicey-purple text-white font-medium px-4 py-1 rounded-full">
                          {winner?.text || "No winner determined"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">All Options</h4>
                      <div className="flex flex-wrap gap-2">
                        {options.map((option) => (
                          <div
                            key={option.id}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              option.id === winner?.id
                                ? "bg-dicey-purple text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {option.text}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {decision?.tie_breaker_used && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Tiebreaker Used</h4>
                        <div className="flex items-center gap-2">
                          {renderDecisionMethod(decision.tie_breaker_type || room.type)}
                          <span className="text-sm">
                            {decision.tie_breaker_type === "dice" && "Dice Roll"}
                            {decision.tie_breaker_type === "coin" && "Coin Flip"}
                            {decision.tie_breaker_type === "spinner" && "Spinner Wheel"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 pt-2 pb-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>With:</span>
                    <div className="flex -space-x-2">
                      {participants.slice(0, 3).map((participant, i) => (
                        <UserAvatar
                          key={`${room.id}-${participant.id}-${i}`}
                          name={participant.profiles?.full_name || "User"}
                          size="xs"
                          src={participant.profiles?.avatar_url || undefined}
                        />
                      ))}
                      {participants.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          +{participants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
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
          <Button onClick={() => window.location.href = '/create-room'}>Create a Room</Button>
        </div>
      )}
    </div>
  );
}
