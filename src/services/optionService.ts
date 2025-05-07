import { supabase } from "@/integrations/supabase/client";
import { Option, Profile } from "./types";
import { handleError, getCurrentUserId } from "./utils";
import { updateParticipantStatus } from "./participantService";

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
      created_by: userId,
    })
    .select()
    .single();

  handleError(error);
  
  // Update participant status to mark as having submitted
  try {
    await updateParticipantStatus(roomId, { has_submitted: true });
  } catch (err) {
    console.error("Could not update participant status:", err);
    // Don't fail the request if this fails
  }
  
  // Fetch the creator's profile separately
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  // Manually construct the option with profile
  const option = {
    ...data,
    profiles: profileData as Profile
  } as Option;
  
  return option;
};

export const getRoomOptions = async (roomId: string): Promise<Option[]> => {
  // Fetch options
  const { data: optionsData, error } = await supabase
    .from("options")
    .select("*")
    .eq("room_id", roomId);

  handleError(error);
  
  if (!optionsData || optionsData.length === 0) {
    return [];
  }
  
  // Get unique creator IDs
  const creatorIds = [...new Set(optionsData.map(o => o.created_by))];
  
  // Fetch profiles separately
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
    .in("id", creatorIds);
  
  // Create a map for quick profile lookups
  const profilesMap: Record<string, Profile> = {};
  profilesData?.forEach(profile => {
    profilesMap[profile.id] = profile as Profile;
  });
  
  // Combine options with creator profiles
  const options = optionsData.map(option => ({
    ...option,
    profiles: profilesMap[option.created_by] as Profile
  })) as Option[];
  
  return options;
};

export const updateOption = async (
  id: string,
  text: string
): Promise<Option> => {
  const { data, error } = await supabase
    .from("options")
    .update({ text })
    .eq("id", id)
    .select()
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
