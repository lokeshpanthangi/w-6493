import { supabase } from "@/integrations/supabase/client";
import { Option, Profile } from "./types";
import { handleError, getCurrentUserId } from "./utils";

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
