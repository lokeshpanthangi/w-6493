
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
    .select()
    .single();

  handleError(error);
  
  // Fetch the profile data separately to avoid recursion
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
    
  // Manually construct the participant object with profile
  const participant = {
    ...data,
    profiles: profileData as Profile
  } as Participant;
  
  return participant;
};

export const getRoomParticipants = async (roomId: string): Promise<Participant[]> => {
  // Fetch participants
  const { data: participantsData, error } = await supabase
    .from("participants")
    .select("*")
    .eq("room_id", roomId);

  handleError(error);
  
  if (!participantsData || participantsData.length === 0) {
    return [];
  }
  
  // Fetch profiles separately
  const userIds = participantsData.map(p => p.user_id);
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);
  
  const profilesMap: Record<string, Profile> = {};
  profilesData?.forEach(profile => {
    profilesMap[profile.id] = profile as Profile;
  });
  
  // Combine participants with their profiles
  const participants = participantsData.map(participant => ({
    ...participant,
    profiles: profilesMap[participant.user_id] as Profile
  })) as Participant[];
  
  return participants;
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
    .select()
    .single();

  handleError(error);
  
  // Fetch the profile data separately
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  // Manually construct the participant object with profile
  const participant = {
    ...data,
    profiles: profileData as Profile
  } as Participant;
  
  return participant;
};
