
export type Room = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  expires_at: string | null;
  phase: "lobby" | "voting" | "results";
  type: string;
  allow_everyone_to_submit: boolean;
  hide_results_until_end: boolean;
  max_participants: number | null;
};

export type Participant = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  is_ready: boolean;
  has_voted: boolean;
  has_submitted: boolean;
  profiles: Profile;
};

export type Option = {
  id: string;
  room_id: string;
  text: string;
  created_by: string;
  created_at: string;
  profiles: Profile;
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
  decided_at: string;
  winning_option_id: string | null;
  tie_breaker_used: boolean;
  tie_breaker_type: string | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};
