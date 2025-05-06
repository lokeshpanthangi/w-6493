
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

// Types
export type Room = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
  expires_at: string | null;
  created_by: string;
  type: "dice" | "spinner" | "coin";
  phase: "lobby" | "submission" | "voting" | "results";
  allow_everyone_to_submit: boolean;
  hide_results_until_end: boolean;
};

export type Participant = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  has_submitted: boolean;
  has_voted: boolean;
  is_ready: boolean;
  profiles?: Profile;
};

export type Option = {
  id: string;
  room_id: string;
  text: string;
  created_at: string;
  created_by: string;
  profiles?: Profile;
};

export type Vote = {
  id: string;
  room_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
};

export type Decision = {
  id: string;
  room_id: string;
  winning_option_id: string | null;
  tie_breaker_used: boolean;
  tie_breaker_type: "dice" | "spinner" | "coin" | null;
  decided_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

// Error handler
const handleError = (error: PostgrestError | null) => {
  if (error) {
    console.error("API error:", error);
    throw new Error(error.message);
  }
};

// Get current user ID helper
const getCurrentUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error("User not authenticated");
  }
  return data.user.id;
};

// Rooms
export const createRoom = async (
  roomData: Omit<Room, "id" | "code" | "created_at" | "created_by" | "phase">
): Promise<Room> => {
  // Generate a random 6-character code
  const { data: codeData, error: codeError } = await supabase.rpc('generate_room_code');
  handleError(codeError);
  
  const code = codeData || Math.random().toString(36).substring(2, 8).toUpperCase();
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      ...roomData,
      code,
      created_by: userId, // Add the created_by field with the current user's ID
    })
    .select("*")
    .single();

  handleError(error);
  return data as Room;
};

export const getRoomByCode = async (code: string): Promise<Room | null> => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  handleError(error);
  return data as Room;
};

export const getRoomById = async (id: string): Promise<Room | null> => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();

  handleError(error);
  return data as Room;
};

export const updateRoom = async (id: string, updates: Partial<Room>): Promise<Room> => {
  const { data, error } = await supabase
    .from("rooms")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  handleError(error);
  return data as Room;
};

export const getUserRooms = async (type: "active" | "recent" = "active"): Promise<Room[]> => {
  let query = supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (type === "active") {
    query = query.neq("phase", "results");
  } else {
    query = query.eq("phase", "results");
  }

  const { data, error } = await query;
  handleError(error);
  return data as Room[];
};

// Participants
export const joinRoom = async (roomId: string): Promise<Participant> => {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from("participants")
    .insert({
      room_id: roomId,
      user_id: userId, // Add the user_id field with the current user's ID
    })
    .select("*")
    .single();

  handleError(error);
  return data as Participant;
};

export const getRoomParticipants = async (roomId: string): Promise<Participant[]> => {
  const { data, error } = await supabase
    .from("participants")
    .select(`
      *,
      profiles:user_id(*)
    `)
    .eq("room_id", roomId);

  handleError(error);
  
  // Transform the data to match the Participant type
  const participants = data?.map(participant => {
    const { profiles, ...rest } = participant;
    return {
      ...rest,
      profiles: profiles as unknown as Profile,
    };
  }) || [];
  
  return participants as Participant[];
};

export const updateParticipantStatus = async (
  roomId: string,
  updates: Partial<Participant>
): Promise<Participant> => {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from("participants")
    .update(updates)
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .select("*")
    .single();

  handleError(error);
  return data as Participant;
};

// Options
export const createOption = async (
  roomId: string,
  text: string
): Promise<Option> => {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from("options")
    .insert({
      room_id: roomId,
      text,
      created_by: userId, // Add the created_by field with the current user's ID
    })
    .select("*")
    .single();

  handleError(error);
  return data as Option;
};

export const getRoomOptions = async (roomId: string): Promise<Option[]> => {
  const { data, error } = await supabase
    .from("options")
    .select(`
      *,
      profiles:created_by(*)
    `)
    .eq("room_id", roomId);

  handleError(error);
  
  // Transform the data to match the Option type
  const options = data?.map(option => {
    const { profiles, ...rest } = option;
    return {
      ...rest,
      profiles: profiles as unknown as Profile,
    };
  }) || [];
  
  return options as Option[];
};

export const updateOption = async (
  id: string,
  text: string
): Promise<Option> => {
  const { data, error } = await supabase
    .from("options")
    .update({ text })
    .eq("id", id)
    .select("*")
    .single();

  handleError(error);
  return data as Option;
};

export const deleteOption = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("options")
    .delete()
    .eq("id", id);

  handleError(error);
};

// Votes
export const castVote = async (
  roomId: string,
  optionId: string
): Promise<Vote> => {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from("votes")
    .insert({
      room_id: roomId,
      option_id: optionId,
      user_id: userId, // Add the user_id field with the current user's ID
    })
    .select("*")
    .single();

  handleError(error);
  
  // Update participant status
  await updateParticipantStatus(roomId, { has_voted: true });
  
  return data as Vote;
};

export const getRoomVotes = async (roomId: string): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("room_id", roomId);

  handleError(error);
  return data as Vote[];
};

export const getVoteCounts = async (roomId: string): Promise<Record<string, number>> => {
  const votes = await getRoomVotes(roomId);
  
  return votes.reduce((counts: Record<string, number>, vote) => {
    counts[vote.option_id] = (counts[vote.option_id] || 0) + 1;
    return counts;
  }, {});
};

// Decisions
export const createDecision = async (
  roomId: string,
  winningOptionId: string | null,
  tieBreakerUsed: boolean = false,
  tieBreakerType: "dice" | "spinner" | "coin" | null = null
): Promise<Decision> => {
  const { data, error } = await supabase
    .from("decisions")
    .insert({
      room_id: roomId,
      winning_option_id: winningOptionId,
      tie_breaker_used: tieBreakerUsed,
      tie_breaker_type: tieBreakerType,
    })
    .select("*")
    .single();

  handleError(error);
  return data as Decision;
};

export const getDecision = async (roomId: string): Promise<Decision | null> => {
  const { data, error } = await supabase
    .from("decisions")
    .select("*")
    .eq("room_id", roomId)
    .single();

  // Decision might not exist yet
  if (error && error.code === "PGRST116") {
    return null;
  }

  handleError(error);
  return data as Decision;
};

export const getUserDecisionsHistory = async (): Promise<{
  rooms: Room[];
  decisions: Decision[];
  options: Option[];
  participants: Participant[];
}> => {
  // Get current user ID
  const userId = await getCurrentUserId();
  
  // Get all rooms with decisions where the user participated
  const { data: participatedRooms, error: participatedError } = await supabase
    .from("participants")
    .select("room_id")
    .eq("user_id", userId);
  
  handleError(participatedError);
  
  if (!participatedRooms || participatedRooms.length === 0) {
    return { rooms: [], decisions: [], options: [], participants: [] };
  }
  
  const roomIds = participatedRooms.map(p => p.room_id);
  
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("*")
    .in("id", roomIds)
    .eq("phase", "results")
    .order("created_at", { ascending: false });
  
  handleError(roomsError);
  
  if (!rooms || rooms.length === 0) {
    return { rooms: [], decisions: [], options: [], participants: [] };
  }
  
  const finalRoomIds = rooms.map(r => r.id);
  
  // Get decisions for these rooms
  const { data: decisions, error: decisionsError } = await supabase
    .from("decisions")
    .select("*")
    .in("room_id", finalRoomIds);
  
  handleError(decisionsError);
  
  // Get options for these rooms
  const { data: optionsData, error: optionsError } = await supabase
    .from("options")
    .select(`
      *,
      profiles:created_by(*)
    `)
    .in("room_id", finalRoomIds);
  
  handleError(optionsError);
  
  // Get participants for these rooms
  const { data: participantsData, error: participantsError } = await supabase
    .from("participants")
    .select(`
      *,
      profiles:user_id(*)
    `)
    .in("room_id", finalRoomIds);
  
  handleError(participantsError);
  
  // Transform the data to match the required types
  const options = optionsData?.map(option => {
    const { profiles, ...rest } = option;
    return {
      ...rest,
      profiles: profiles as unknown as Profile,
    };
  }) || [];
  
  const participants = participantsData?.map(participant => {
    const { profiles, ...rest } = participant;
    return {
      ...rest,
      profiles: profiles as unknown as Profile,
    };
  }) || [];
  
  return {
    rooms: rooms as Room[],
    decisions: decisions as Decision[] || [],
    options: options as Option[] || [],
    participants: participants as Participant[] || [],
  };
};

// Profiles
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  handleError(error);
  return data as Profile;
};

export const updateProfile = async (
  updates: Partial<Omit<Profile, "id" | "created_at">>
): Promise<Profile> => {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  handleError(error);
  return data as Profile;
};
