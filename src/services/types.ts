
import { Profile } from "./profileService";

export type Room = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
  expires_at: string | null;
  created_by: string;
  type: "dice" | "spinner" | "coin";
  phase: "lobby" | "submission" | "voting" | "results";
  allow_everyone_to_submit: boolean;
  hide_results_until_end: boolean;
};

export type Participant = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  has_submitted: boolean;
  has_voted: boolean;
  is_ready: boolean;
  profiles?: Profile;
};

export type Option = {
  id: string;
  room_id: string;
  text: string;
  created_at: string;
  created_by: string;
  profiles?: Profile;
};

export type Vote = {
  id: string;
  room_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
};

export type Decision = {
  id: string;
  room_id: string;
  winning_option_id: string | null;
  tie_breaker_used: boolean;
  tie_breaker_type: "dice" | "spinner" | "coin" | null;
  decided_at: string;
};
