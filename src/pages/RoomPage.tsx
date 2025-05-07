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
import { useRoomRealtime } from "@/hooks/useRealtime";
import { getRoomParticipants, updateParticipantStatus } from "@/services/participantService";
import { castVote } from "@/services/voteService";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserId } from "@/services/utils";
import dayjs from "dayjs";
import { updateRoom } from "@/services/roomService";
import { getProfile } from "@/services/profileService";

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
  has_submitted: boolean;
  has_voted: boolean;
  is_ready: boolean;
}

export default function RoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roomId } = useParams<{ roomId: string }>();
  
  // Use real-time hook
  const { room, participants, options, votes, loading, error } = useRoomRealtime(roomId!);
  const [newOption, setNewOption] = useState("");
  const [editingOption, setEditingOption] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roomPhase, setRoomPhase] = useState<"lobby" | "submission" | "voting" | "results">("submission");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [showAddActivity, setShowAddActivity] = useState(false);

  useEffect(() => {
    setIsLoading(loading);
    if (room) setRoomPhase(room.phase as any);
    getCurrentUserId().then(setCurrentUserId);
  }, [loading, room]);

  // Timer effect
  useEffect(() => {
    if (room?.expires_at && room?.phase !== 'results') {
      const updateTimer = () => {
        const expires = dayjs(room.expires_at);
        const now = dayjs();
        const diff = expires.diff(now, 'second');
        setTimer(diff > 0 ? diff : 0);
        if (diff <= 0 && room.phase !== 'results') {
          // Move room to expired (results) phase
          updateRoom(room.id, { phase: 'results' });
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [room?.expires_at, room?.phase, room?.id]);

  // Set creator name from participants' profiles if available, otherwise fetch from profiles table
  useEffect(() => {
    async function setCreator() {
      if (room) {
        // Try to find creator in participants
        const creator = participants.find(p => p.user_id === room.created_by);
        if (creator && creator.profiles?.full_name) {
          setCreatorName(creator.profiles.full_name);
        } else {
          // Always fetch from profiles table if not found
          const profile = await getProfile(room.created_by);
          setCreatorName(profile?.full_name || room.created_by);
        }
      }
    }
    setCreator();
  }, [room, participants]);

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add new activity/option
  const handleAddOption = async () => {
    if (!newOption.trim() || !roomId) return;
    const userId = await getCurrentUserId();
    const { error } = await supabase.from("options").insert({
      room_id: roomId,
      text: newOption,
      created_by: userId,
    });
    if (error) {
      toast({ title: "Error", description: error.message });
    } else {
      setNewOption("");
      toast({ title: "Option added", description: "Your option has been added to the list" });
    }
  };

  // Voting
  const handleVote = async (optionId: string) => {
    if (!roomId) return;
    try {
      await castVote(roomId, optionId);
      toast({ title: "Vote cast", description: "Your vote has been recorded." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message });
    }
  };

  // Mark as ready
  const handleReady = async () => {
    if (!roomId) return;
    await updateParticipantStatus(roomId, { is_ready: true });
    setIsReady(true);
    toast({ title: "You're ready!", description: "Waiting for other participants to be ready" });
  };

  // Mark as not ready
  const handleNotReady = async () => {
    if (!roomId) return;
    await updateParticipantStatus(roomId, { is_ready: false });
    setIsReady(false);
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
    const codeToCopy = room?.code || roomId || "";
    navigator.clipboard.writeText(codeToCopy);
    toast({
      title: "Room code copied",
      description: "Share this code with others to join",
    });
  };

  // Calculate progress for the submission phase
  const submissionProgress = Math.round(
    (participants.filter(p => p.has_submitted).length / participants.length) * 100
  );
  
  // Calculate progress for the readiness state
  const readyProgress = Math.round(
    (participants.filter(p => p.is_ready).length / participants.length) * 100
  );

  // Helper for decision method label and icon
  const getDecisionMethod = (type: string) => {
    switch (type) {
      case "dice":
        return { label: "Dice Roll", icon: <Dice3D size="sm" /> };
      case "coin":
        return { label: "Coin Flip", icon: <CoinFlip size="sm" /> };
      case "spinner":
      default:
        return { label: "Spinner Wheel", icon: <div className="spinner-wheel w-6 h-6"></div> };
    }
  };

  // In the Room Info card, always show the creator's name from participants' profiles if available, otherwise fallback to the current user's name if they are the creator, or UID as last resort
  const getCurrentUserName = () => {
    // Try to get the current user's name from the participants list
    const me = participants.find(p => p.user_id === currentUserId);
    return me?.profiles?.full_name || "You";
  };
  const creatorInfo = (() => {
    if (!room || !participants) return null;
    const creator = participants.find(p => p.user_id === room.created_by);
    if (creator && creator.profiles?.full_name) {
      return {
        name: creator.profiles.full_name,
        avatar: creator.profiles.avatar_url,
      };
    } else if (room.created_by === currentUserId) {
      return {
        name: getCurrentUserName(),
        avatar: undefined,
      };
    } else {
      return {
        name: creatorName || room.created_by || "-",
        avatar: undefined,
      };
    }
  })();

  const isCurrentUserParticipant = participants.some(p => p.user_id === currentUserId);

  const allParticipants = (() => {
    if (!room) return [];
    if (participants.length > 0) return participants;
    // If no participants and current user is NOT a participant, show creator as default
    if (!isCurrentUserParticipant) {
      return [{
        id: "creator",
        user_id: room.created_by,
        profiles: { full_name: creatorName, avatar_url: undefined },
        is_ready: false,
        has_submitted: false,
        has_voted: false,
      }];
    }
    return [];
  })();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin">
            {room?.type === "dice" && <Dice3D size="lg" />}
            {room?.type === "coin" && <CoinFlip size="lg" />}
            {room?.type === "spinner" && (
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
                <h1 className="text-2xl font-bold">{room?.name}</h1>
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
              {room?.description && (
                <p className="text-muted-foreground mt-1">{room.description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2 self-end">
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {timer !== null ? formatTimeRemaining(timer) : "-"}
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
                  {roomPhase !== 'results' && roomPhase === "submission" && (
                    <div className="space-y-6">
                      {/* Add Activity Button */}
                      {!showAddActivity && !editingOption && (
                        <Button onClick={() => setShowAddActivity(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Add Activity
                        </Button>
                      )}
                      {/* Option submission form */}
                      {(showAddActivity || editingOption) && (
                        <div className="space-y-3">
                          <Label htmlFor="option">
                            {editingOption ? "Update Option" : "Add an Activity"}
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id="option"
                              placeholder="Enter your activity here"
                              value={newOption}
                              onChange={(e) => setNewOption(e.target.value)}
                            />
                            <Button onClick={handleAddOption}>
                              {editingOption ? "Update" : "Add"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              onClick={() => {
                                setEditingOption(null);
                                setNewOption("");
                                setShowAddActivity(false);
                              }}
                            >
                              Cancel
                            </Button>
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
                                  option.created_by === currentUserId ? "bg-muted/40" : ""
                                }`}
                              >
                                <div className="space-y-1">
                                  <p>{option.text}</p>
                                  {option.created_by === currentUserId && (
                                    <p className="text-xs text-muted-foreground">
                                      Added by you
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3 pt-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">Options Submitted</h3>
                          <span className="text-sm text-muted-foreground">
                            {participants.filter(p => p.has_submitted).length} / {participants.length} participants
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
                            <Button variant="ghost" size="sm" onClick={handleNotReady}>
                              Cancel
                            </Button>
                          </div>
                        )}
                        
                        {room?.created_by === currentUserId && (
                          <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium">Ready to Vote</h3>
                              <span className="text-sm text-muted-foreground">
                                {participants.filter(p => p.is_ready).length} / {participants.length} participants
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
                  
                  {roomPhase !== 'results' && roomPhase === "voting" && (
                    <div className="space-y-4">
                      <p>Time to vote! Select your preferred option:</p>
                      
                      <div className="grid gap-3">
                        {options.map((option) => (
                          <Button
                            key={option.id}
                            variant="outline"
                            className="justify-start h-auto py-6 text-base"
                            onClick={() => handleVote(option.id)}
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
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {allParticipants.map((participant) => (
                      <div 
                        key={participant.id} 
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <UserAvatar 
                            name={participant.profiles?.full_name || "-"} 
                            src={participant.profiles?.avatar_url}
                            size="sm"
                          />
                          <span className="text-sm">
                            {participant.user_id === currentUserId
                              ? (participant.profiles?.full_name ? `${participant.profiles.full_name} (YOU)` : "YOU")
                              : participant.profiles?.full_name || "-"}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {participant.is_ready && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Ready
                            </Badge>
                          )}
                          {participant.has_submitted && roomPhase === "submission" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Submitted
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {allParticipants.length} participant{allParticipants.length !== 1 ? "s" : ""}
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
                    <div className="font-mono text-lg font-bold">{room?.code || "-"}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                    <p>{creatorInfo?.name || "-"}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Decision Method</h3>
                    <div className="flex items-center gap-2">
                      {getDecisionMethod(room?.type || "spinner").icon}
                      <span>{getDecisionMethod(room?.type || "spinner").label}</span>
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
