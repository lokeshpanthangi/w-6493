
import { supabase } from "@/integrations/supabase/client";
import { Vote } from "./types";
import { handleError, getCurrentUserId } from "./utils";
import { updateParticipantStatus } from "./participantService";

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
      user_id: userId,
    })
    .select()
    .single();

  handleError(error);
  
  // Update participant status
  await updateParticipantStatus(roomId, { has_voted: true });
  
  return data as Vote;
};

export const getRoomVotes = async (roomId: string): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select()
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
