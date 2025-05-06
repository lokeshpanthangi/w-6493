
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

// Error handler
export const handleError = (error: PostgrestError | null) => {
  if (error) {
    console.error("API error:", error);
    throw new Error(error.message);
  }
};

// Get current user ID helper
export const getCurrentUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new Error("User not authenticated");
  }
  return data.user.id;
};
