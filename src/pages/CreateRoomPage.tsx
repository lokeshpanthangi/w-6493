
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Dice3D } from "@/components/ui/dice-3d";
import { CoinFlip } from "@/components/ui/coin-flip";
import { SpinnerWheel } from "@/components/ui/spinner-wheel";
import { RoomCodeDisplay } from "@/components/room/RoomCodeDisplay";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Check, Clock, Copy, Plus, Share, Users, X } from "lucide-react";
import { createRoom, joinRoom } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

interface DecisionTypeOption {
  id: "dice" | "coin" | "spinner";
  name: string;
  description: string;
  icon: JSX.Element;
}

const roomFormSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional(),
  maxParticipants: z.number().int().nonnegative(),
  timeLimit: z.number().int().min(5).max(120),
  decisionTypes: z.array(z.enum(["dice", "coin", "spinner"])),
  allowEveryoneToSubmit: z.boolean().default(true),
  hideResultsUntilEnd: z.boolean().default(false),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

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

const STEPS = [
  { id: "basics", name: "Room Basics" },
  { id: "settings", name: "Settings" },
  { id: "review", name: "Review & Create" },
  { id: "share", name: "Share Room" },
];

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [roomId, setRoomId] = useState("");
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: "",
      description: "",
      maxParticipants: 0, // 0 means unlimited
      timeLimit: 30, // 30 minutes default
      decisionTypes: ["spinner"],
      allowEveryoneToSubmit: true,
      hideResultsUntilEnd: false,
    },
  });

  const toggleDecisionType = (type: "dice" | "coin" | "spinner") => {
    const currentValues = form.getValues().decisionTypes;
    
    if (currentValues.includes(type)) {
      // Remove if already selected
      const updatedTypes = currentValues.filter(t => t !== type);
      form.setValue("decisionTypes", updatedTypes);
    } else {
      // Add if not selected
      form.setValue("decisionTypes", [...currentValues, type]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !form.getValues().name) {
      toast({
        title: "Room name required",
        description: "Please enter a name for your decision room",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // If we're moving to the final step, create the room
      if (currentStep === STEPS.length - 2) {
        handleCreateRoom();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);

    try {
      const formValues = form.getValues();
      
      // Calculate expiry date based on time limit (in minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + formValues.timeLimit);
      
      // Use the first selected decision type as the primary type (will be extended in the future)
      // If no decision types are selected, default to spinner
      const primaryDecisionType = formValues.decisionTypes.length > 0 ? 
        formValues.decisionTypes[0] : "spinner";
      
      // Create the room
      const room = await createRoom({
        name: formValues.name,
        description: formValues.description || null,
        expires_at: expiresAt.toISOString(),
        type: primaryDecisionType,
        allow_everyone_to_submit: formValues.allowEveryoneToSubmit,
        hide_results_until_end: formValues.hideResultsUntilEnd,
        max_participants: formValues.maxParticipants || null,
      });
      
      // Join the room as creator
      await joinRoom(room.id);
      
      setRoomId(room.id);
      setRoomCode(room.code);
      
      toast({
        title: "Room created!",
        description: `Your ${primaryDecisionType} decision room is ready to share.`,
      });
      
      setRoomCreated(true);
    } catch (error: any) {
      toast({
        title: "Error creating room",
        description: error.message || "An error occurred while creating the room",
        variant: "destructive",
      });
      console.error("Error creating room:", error);
      // Go back to the review step if creation fails
      setCurrentStep(2);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard",
    });
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${roomCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
  };

  const handleNavigateToRoom = () => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Create a Decision Room</h1>
        <p className="text-muted-foreground">
          Set up a new room for your group to make a decision together
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{STEPS[currentStep].name}</span>
        </div>
        <Progress value={(currentStep + 1) / STEPS.length * 100} className="h-2" />
        
        <div className="hidden md:flex justify-between mt-2">
          {STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-1 ${
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
              </div>
              <span className="text-xs font-medium">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form className="space-y-6">
          {/* Step 1: Room Basics */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Dinner Plans, Movie Night, Vacation Destination"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Description <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What are you deciding on? Add any details for participants."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="decisionTypes"
                render={() => (
                  <FormItem className="space-y-2">
                    <FormLabel>Decision Methods <span className="text-muted-foreground text-xs">(Select one or more)</span></FormLabel>
                    <FormMessage />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {decisionTypes.map((type) => {
                        const isSelected = form.getValues().decisionTypes.includes(type.id);
                        return (
                          <Card 
                            key={type.id}
                            className={`cursor-pointer transition-all ${
                              isSelected ? "border-2 border-dicey-purple" : "hover:border-dicey-purple hover:border-opacity-50"
                            }`}
                            onClick={() => toggleDecisionType(type.id)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{type.name}</CardTitle>
                                <div className="flex items-center">
                                  {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-dicey-purple flex items-center justify-center mr-2">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                  <div>{type.icon}</div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <CardDescription>{type.description}</CardDescription>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Select one or more decision methods to use in your room. If you don't select any, the spinner will be used by default.
                    </p>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Room Settings */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Maximum Participants <span className="text-muted-foreground text-xs">(Optional)</span></FormLabel>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0 (unlimited)"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter 0 for unlimited participants
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="5"
                        max="120"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How long will this decision room stay active?
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowEveryoneToSubmit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Allow everyone to submit options
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        When disabled, only you can add options to the decision
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hideResultsUntilEnd"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Hide results until all votes are in
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        For maximum suspense! Results are revealed only after everyone votes
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Review & Create */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Details</CardTitle>
                  <CardDescription>Review your decision room setup before creating</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                      <p>{form.getValues().name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Decision Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        {form.getValues().decisionTypes.length > 0 ? (
                          form.getValues().decisionTypes.map(type => (
                            <div key={type} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                              {type === "dice" && <Dice3D size="sm" />}
                              {type === "coin" && <CoinFlip size="sm" />}
                              {type === "spinner" && <div className="spinner-wheel w-4 h-4"></div>}
                              <span className="text-sm">
                                {decisionTypes.find(t => t.id === type)?.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                            <div className="spinner-wheel w-4 h-4"></div>
                            <span className="text-sm">Spinner Wheel (Default)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {form.getValues().description && (
                      <div className="space-y-2 md:col-span-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p>{form.getValues().description}</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Time Limit</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{form.getValues().timeLimit} minutes</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Max Participants</h3>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {form.getValues().maxParticipants > 0 
                            ? form.getValues().maxParticipants 
                            : "Unlimited"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Room Settings</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {form.getValues().allowEveryoneToSubmit ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            <Check className="h-3 w-3 mr-1" />
                            Everyone can submit options
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                            <X className="h-3 w-3 mr-1" />
                            Only you can submit options
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {form.getValues().hideResultsUntilEnd ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                            <Check className="h-3 w-3 mr-1" />
                            Results hidden until all votes are in
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <X className="h-3 w-3 mr-1" />
                            Results visible during voting
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Share Room */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card className="border-dicey-purple-dark/30 bg-gradient-to-br from-white to-dicey-purple-light/20">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-2">
                    {form.getValues().decisionTypes.includes("dice") && <Dice3D size="lg" />}
                    {form.getValues().decisionTypes.includes("coin") && !form.getValues().decisionTypes.includes("dice") && <CoinFlip size="lg" />}
                    {(form.getValues().decisionTypes.includes("spinner") || form.getValues().decisionTypes.length === 0) && 
                     !form.getValues().decisionTypes.includes("dice") && 
                     !form.getValues().decisionTypes.includes("coin") && (
                      <SpinnerWheel size="lg" options={["Ready!", "To Go!", "Decide!"]} />
                    )}
                  </div>
                  <CardTitle className="text-2xl">Your Room is Ready!</CardTitle>
                  <CardDescription>Share this room code with others to join</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RoomCodeDisplay code={roomCode} onCopy={handleCopyRoomCode} />
                  
                  <Tabs defaultValue="link" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="link">Invite Link</TabsTrigger>
                      <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="link" className="space-y-4">
                      <div className="flex space-x-2 mt-4">
                        <Input 
                          readOnly 
                          value={`${window.location.origin}/join/${roomCode}`} 
                          className="bg-muted"
                        />
                        <Button variant="outline" size="icon" onClick={handleCopyInviteLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Share this link with your friends to join the decision room
                      </p>
                    </TabsContent>
                    <TabsContent value="qrcode" className="flex flex-col items-center justify-center py-2">
                      <div className="bg-white p-4 rounded-lg">
                        {/* QR code would be rendered here in a real implementation */}
                        <div className="w-48 h-48 border-2 border-dashed border-dicey-purple flex items-center justify-center">
                          <p className="text-center text-sm text-muted-foreground">QR code for room<br/>{roomCode}</p>
                        </div>
                      </div>
                      <p className="text-sm text-center text-muted-foreground mt-4">
                        Scan this code with a phone camera to join
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
            )}
            
            {currentStep === 0 && (
              <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
            )}
            
            {currentStep < STEPS.length - 2 && (
              <Button type="button" className="ml-auto" onClick={handleNextStep}>
                Continue
              </Button>
            )}
            
            {currentStep === STEPS.length - 2 && (
              <Button 
                type="button" 
                className="ml-auto" 
                onClick={handleNextStep}
                disabled={isCreating}
              >
                {isCreating ? (
                  <div className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    Creating Room...
                  </div>
                ) : (
                  "Create Room"
                )}
              </Button>
            )}
            
            {currentStep === STEPS.length - 1 && (
              <Button type="button" onClick={handleNavigateToRoom}>
                Go to Room
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
