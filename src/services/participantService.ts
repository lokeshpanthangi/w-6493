
import { supabase } from "@/integrations/supabase/client";
import { Participant } from "./types";
import { handleError, getCurrentUserId } from "./utils";
import { Profile } from "./types";

export const joinRoom = async (roomId: string): Promise<Participant> => {
  const userId = await getCurrentUserId();
  
  // Check if user is already a participant to avoid duplicates
  const { data: existingParticipant } = await supabase
    .from("participants")
    .select("*")
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .maybeSingle();
    
  if (existingParticipant) {
    return existingParticipant as Participant;
  }
  
  // Create new participant entry
  const { data, error } = await supabase
    .from("participants")
    .insert({
      room_id: roomId,
      user_id: userId,
    })
    .select("*")
    .single();

  handleError(error);
  return data as Participant;
};

export const getRoomParticipants = async (roomId: string): Promise<Participant[]> => {
  // Use a simple join query without self-reference to avoid infinite recursion
  const { data, error } = await supabase
    .from("participants")
    .select(`
      id,
      room_id,
      user_id,
      joined_at,
      is_ready,
      has_voted,
      has_submitted,
      profiles:user_id(id, full_name, avatar_url, created_at)
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
