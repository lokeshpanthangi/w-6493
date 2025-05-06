
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useToast } from "@/components/ui/use-toast";
import { RoomCodeDisplay } from "@/components/room/RoomCodeDisplay";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";
import { SpinnerWheel } from "@/components/ui/spinner-wheel";
import { Clock, Plus, Share, Trash, Edit, Check, X } from "lucide-react";

// Mock room phases
type RoomPhase = "lobby" | "submission" | "voting" | "results";

// Define the room decision method types
type RoomDecisionMethod = "spinner" | "dice" | "coin";

// Mock option type
interface Option {
  id: string;
  text: string;
  createdBy: string;
  isYours: boolean;
}

// Mock participant type
interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "away" | "offline";
  hasSubmitted: boolean;
  hasVoted: boolean;
  isReady: boolean;
}

export default function RoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roomId } = useParams<{ roomId: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [roomPhase, setRoomPhase] = useState<RoomPhase>("submission");
  const [roomDetails, setRoomDetails] = useState({
    name: "Movie Night Decision",
    description: "Let's decide which movie to watch tonight!",
    createdBy: "Alex",
    type: "spinner" as RoomDecisionMethod,
    timeRemaining: 1800, // seconds
    allowEveryoneToSubmit: true,
    hideResultsUntilEnd: true,
    isCreator: true,
  });
  
  const [newOption, setNewOption] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingOption, setEditingOption] = useState<Option | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Load room data
  useEffect(() => {
    // Mock API call to fetch room data
    setTimeout(() => {
      // Mock participants
      setParticipants([
        {
          id: "1",
          name: "Alex",
          status: "online",
          hasSubmitted: true,
          hasVoted: false,
          isReady: true,
        },
        {
          id: "2",
          name: "Taylor",
          status: "online",
          hasSubmitted: false,
          hasVoted: false,
          isReady: false,
        },
        {
          id: "3",
          name: "Jordan",
          status: "away",
          hasSubmitted: true,
          hasVoted: false,
          isReady: true,
        },
      ]);
      
      // Mock options
      setOptions([
        {
          id: "opt1",
          text: "The Matrix",
          createdBy: "Alex",
          isYours: true,
        },
        {
          id: "opt2",
          text: "Inception",
          createdBy: "Jordan",
          isYours: false,
        },
      ]);
      
      setIsLoading(false);
    }, 1500);
    
    // Countdown timer
    const timer = setInterval(() => {
      setRoomDetails(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [roomId]);

  // Handle adding a new option
  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const newId = `opt${options.length + 1}`;
    setOptions([...options, {
      id: newId,
      text: newOption,
      createdBy: "You",
      isYours: true,
    }]);
    
    setNewOption("");
    
    toast({
      title: "Option added",
      description: "Your option has been added to the list",
    });
  };

  // Handle updating an option
  const handleUpdateOption = () => {
    if (!editingOption || !newOption.trim()) return;
    
    setOptions(options.map(opt => 
      opt.id === editingOption.id ? { ...opt, text: newOption } : opt
    ));
    
    setEditingOption(null);
    setNewOption("");
    
    toast({
      title: "Option updated",
      description: "Your option has been updated",
    });
  };

  // Handle deleting an option
  const handleDeleteOption = (id: string) => {
    setOptions(options.filter(opt => opt.id !== id));
    
    toast({
      title: "Option removed",
      description: "The option has been removed from the list",
    });
  };

  // Handle setting user as ready
  const handleReady = () => {
    setIsReady(true);
    
    // Update participant list (in a real app this would be via API)
    setParticipants(participants.map(p =>
      p.id === "1" ? { ...p, isReady: true } : p
    ));
    
    toast({
      title: "You're ready!",
      description: "Waiting for other participants to be ready",
    });
  };

  // Handle starting the voting phase
  const handleStartVoting = () => {
    setRoomPhase("voting");
    
    toast({
      title: "Voting started",
      description: "The voting phase has begun!",
    });
  };

  // Handle showing room code
  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomId || "");
    
    toast({
      title: "Room code copied",
      description: "Share this code with others to join",
    });
  };

  // Calculate progress for the submission phase
  const submissionProgress = Math.round(
    (participants.filter(p => p.hasSubmitted).length / participants.length) * 100
  );
  
  // Calculate progress for the readiness state
  const readyProgress = Math.round(
    (participants.filter(p => p.isReady).length / participants.length) * 100
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin">
            {roomDetails.type === "dice" && <Dice3D size="lg" />}
            {roomDetails.type === "coin" && <CoinFlip size="lg" />}
            {roomDetails.type === "spinner" && (
              <SpinnerWheel size="md" options={["Loading", "Please", "Wait"]} />
            )}
          </div>
          <p className="text-muted-foreground">Loading room details...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{roomDetails.name}</h1>
                <Badge
                  variant="outline"
                  className={
                    roomPhase === "submission"
                      ? "bg-blue-50 text-blue-700"
                      : roomPhase === "voting"
                      ? "bg-amber-50 text-amber-700"
                      : roomPhase === "results"
                      ? "bg-green-50 text-green-700"
                      : ""
                  }
                >
                  {roomPhase === "lobby" && "Lobby"}
                  {roomPhase === "submission" && "Submission Phase"}
                  {roomPhase === "voting" && "Voting Phase"}
                  {roomPhase === "results" && "Results"}
                </Badge>
              </div>
              {roomDetails.description && (
                <p className="text-muted-foreground mt-1">{roomDetails.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2 self-end">
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatTimeRemaining(roomDetails.timeRemaining)}
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={() => handleCopyRoomCode()}>
                <Share className="h-4 w-4 mr-2" />
                Share Room
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="md:col-span-2 space-y-6">
              {/* Current Phase Content */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {roomPhase === "lobby" && "Waiting for Participants"}
                    {roomPhase === "submission" && "Submit Your Options"}
                    {roomPhase === "voting" && "Vote for an Option"}
                    {roomPhase === "results" && "The Results Are In!"}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {roomPhase === "submission" && (
                    <div className="space-y-6">
                      {/* Option submission form */}
                      {(roomDetails.allowEveryoneToSubmit || roomDetails.isCreator) && (
                        <div className="space-y-3">
                          <Label htmlFor="option">
                            {editingOption ? "Update Option" : "Add an Option"}
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id="option"
                              placeholder="Enter your option here"
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                            />
                            {editingOption ? (
                              <>
                                <Button onClick={handleUpdateOption}>
                                  Update
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  onClick={() => {
                                    setEditingOption(null);
                                    setNewOption("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button onClick={handleAddOption}>
                                <Plus className="h-4 w-4 mr-2" /> Add
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Current Options</h3>
                        {options.length === 0 ? (
                          <div className="border rounded-md p-4 text-center text-muted-foreground">
                            No options submitted yet. Be the first!
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {options.map((option) => (
                              <div 
                                key={option.id} 
                                className={`border rounded-md p-3 flex justify-between items-center ${
                                  option.isYours ? "bg-muted/40" : ""
                                }`}
                              >
                                <div className="space-y-1">
                                  <p>{option.text}</p>
                                  {option.isYours && (
                                    <p className="text-xs text-muted-foreground">
                                      Added by you
                                    </p>
                                  )}
                                </div>
                                
                                {option.isYours && (
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => {
                                      setEditingOption(option);
                                      setNewOption(option.text);
                                    }}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteOption(option.id)}>
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 pt-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">Options Submitted</h3>
                          <span className="text-sm text-muted-foreground">
                            {participants.filter(p => p.hasSubmitted).length} / {participants.length} participants
                          </span>
                        </div>
                        <Progress value={submissionProgress} className="h-2" />
                        
                        {!isReady && options.length > 0 && (
                          <Button className="w-full mt-4" onClick={handleReady}>
                            I'm Ready to Vote
                          </Button>
                        )}
                        
                        {isReady && (
                          <div className="flex items-center justify-between rounded-md border p-3 bg-muted/40">
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="font-medium">You're ready to vote</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsReady(false)}>
                              Cancel
                            </Button>
                          </div>
                        )}
                        
                        {roomDetails.isCreator && (
                          <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium">Ready to Vote</h3>
                              <span className="text-sm text-muted-foreground">
                                {participants.filter(p => p.isReady).length} / {participants.length} participants
                              </span>
                            </div>
                            <Progress value={readyProgress} className="h-2 mt-2 mb-4" />
                            <Button className="w-full" onClick={handleStartVoting}>
                              Start Voting Phase
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {roomPhase === "voting" && (
                    <div className="space-y-4">
                      <p>Time to vote! Select your preferred option:</p>
                      
                      <div className="grid gap-3">
                        {options.map((option) => (
                          <Button
                            key={option.id}
                            variant="outline"
                            className="justify-start h-auto py-6 text-base"
                          >
                            {option.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Side panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Participants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.map((participant) => (
                    <div 
                      key={participant.id} 
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar 
                          name={participant.name} 
                          src={participant.avatar}
                          size="sm"
                          status={participant.status}
                        />
                        <span className="text-sm">{participant.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {participant.isReady && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Ready
                          </Badge>
                        )}
                        {participant.hasSubmitted && roomPhase === "submission" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Submitted
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {participants.length} participants
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleCopyRoomCode()}>
                    Invite More
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Room info card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Room Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Room Code</h3>
                    <div className="font-mono text-lg font-bold">{roomId}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                    <p>{roomDetails.createdBy}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Decision Method</h3>
                    <div className="flex items-center gap-2">
                      {roomDetails.type === "dice" && <Dice3D size="sm" />}
                      {roomDetails.type === "coin" && <CoinFlip size="sm" />}
                      {roomDetails.type === "spinner" && <div className="spinner-wheel w-6 h-6"></div>}
                      <span>
                        {roomDetails.type === "dice" && "Dice Roll"}
                        {roomDetails.type === "coin" && "Coin Flip"}
                        {roomDetails.type === "spinner" && "Spinner Wheel"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
