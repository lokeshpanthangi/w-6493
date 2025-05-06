import { supabase } from "@/integrations/supabase/client";
import { Room, Decision, Option, Participant, Profile } from "./types";
import { handleError, getCurrentUserId } from "./utils";

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
