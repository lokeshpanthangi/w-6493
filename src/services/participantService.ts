import { supabase } from "@/integrations/supabase/client";
import { Participant, Profile } from "./types";
import { handleError, getCurrentUserId } from "./utils";

export const joinRoom = async (roomId: string): Promise<Participant> => {
  const userId = await getCurrentUserId();
  
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
