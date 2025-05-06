
import { supabase } from "@/integrations/supabase/client";
import { Decision } from "./types";
import { handleError } from "./utils";

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
