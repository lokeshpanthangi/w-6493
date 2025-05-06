
import { supabase } from "@/integrations/supabase/client";
import { Room } from "./types";
import { handleError, getCurrentUserId } from "./utils";

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
      created_by: userId, 
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
  const userId = await getCurrentUserId();
  
  // Get rooms where the user is a participant
  const { data: participantRooms, error: participantError } = await supabase
    .from('participants')
    .select('room_id')
    .eq('user_id', userId);

  handleError(participantError);
  
  if (!participantRooms || participantRooms.length === 0) {
    return [];
  }
  
  const roomIds = participantRooms.map(p => p.room_id);
  
  let query = supabase
    .from("rooms")
    .select("*")
    .in('id', roomIds)
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
