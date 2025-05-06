
import { supabase } from "@/integrations/supabase/client";
import { handleError, getCurrentUserId } from "./utils";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

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
