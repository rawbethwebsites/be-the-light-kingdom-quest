import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          code: string;
          title: string;
          host_session_token: string;
          status: 'lobby' | 'active' | 'paused' | 'ended';
          active_game_key: string | null;
          active_question_index: number;
          active_question_id: string | null;
          timer_started_at: string | null;
          timer_ends_at: string | null;
          joins_locked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code?: string;
          title?: string;
          host_session_token?: string;
          status?: 'lobby' | 'active' | 'paused' | 'ended';
          active_game_key?: string | null;
          active_question_index?: number;
          active_question_id?: string | null;
          timer_started_at?: string | null;
          timer_ends_at?: string | null;
          joins_locked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          host_session_token?: string;
          status?: 'lobby' | 'active' | 'paused' | 'ended';
          active_game_key?: string | null;
          active_question_index?: number;
          active_question_id?: string | null;
          timer_started_at?: string | null;
          timer_ends_at?: string | null;
          joins_locked?: boolean;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          room_id: string;
          name: string;
          color: string;
          icon: string;
          score: number;
          streak: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          name: string;
          color?: string;
          icon?: string;
          score?: number;
          streak?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          name?: string;
          color?: string;
          icon?: string;
          score?: number;
          streak?: number;
          created_at?: string;
        };
      };
      players: {
        Row: {
          id: string;
          room_id: string;
          team_id: string | null;
          nickname: string;
          session_token: string;
          is_active: boolean;
          joined_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          team_id?: string | null;
          nickname: string;
          session_token?: string;
          is_active?: boolean;
          joined_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          team_id?: string | null;
          nickname?: string;
          session_token?: string;
          is_active?: boolean;
          joined_at?: string;
          last_seen_at?: string;
        };
      };
      game_questions: {
        Row: {
          id: string;
          game_key: string;
          sequence: number;
          question_text: string;
          question_type: string;
          options: Json;
          correct_option: number;
          explanation: string | null;
          bible_reference: string | null;
          source_label: string;
          time_limit_seconds: number;
          difficulty: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_key: string;
          sequence: number;
          question_text: string;
          question_type: string;
          options: Json;
          correct_option: number;
          explanation?: string | null;
          bible_reference?: string | null;
          source_label?: string;
          time_limit_seconds?: number;
          difficulty?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_key?: string;
          sequence?: number;
          question_text?: string;
          question_type?: string;
          options?: Json;
          correct_option?: number;
          explanation?: string | null;
          bible_reference?: string | null;
          source_label?: string;
          time_limit_seconds?: number;
          difficulty?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      answers: {
        Row: {
          id: string;
          room_id: string;
          player_id: string;
          team_id: string;
          question_id: string;
          selected_option: number;
          submitted_at: string;
          response_time_ms: number | null;
          points_awarded: number;
        };
        Insert: {
          id?: string;
          room_id: string;
          player_id: string;
          team_id: string;
          question_id: string;
          selected_option: number;
          submitted_at?: string;
          response_time_ms?: number | null;
          points_awarded?: number;
        };
        Update: {
          id?: string;
          room_id?: string;
          player_id?: string;
          team_id?: string;
          question_id?: string;
          selected_option?: number;
          submitted_at?: string;
          response_time_ms?: number | null;
          points_awarded?: number;
        };
      };
      missions: {
        Row: {
          id: string;
          room_id: string;
          team_id: string;
          mission_key: string;
          problem_text: string | null;
          ai_prompt: string | null;
          solution_text: string | null;
          safety_rule: string | null;
          slogan: string | null;
          submitted_at: string;
          host_score: number;
          vote_count: number;
        };
        Insert: {
          id?: string;
          room_id: string;
          team_id: string;
          mission_key: string;
          problem_text?: string | null;
          ai_prompt?: string | null;
          solution_text?: string | null;
          safety_rule?: string | null;
          slogan?: string | null;
          submitted_at?: string;
          host_score?: number;
          vote_count?: number;
        };
        Update: {
          id?: string;
          room_id?: string;
          team_id?: string;
          mission_key?: string;
          problem_text?: string | null;
          ai_prompt?: string | null;
          solution_text?: string | null;
          safety_rule?: string | null;
          slogan?: string | null;
          submitted_at?: string;
          host_score?: number;
          vote_count?: number;
        };
      };
      votes: {
        Row: {
          id: string;
          room_id: string;
          mission_id: string;
          player_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          mission_id: string;
          player_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          mission_id?: string;
          player_id?: string;
          created_at?: string;
        };
      };
      game_events: {
        Row: {
          id: string;
          room_id: string;
          event_type: string;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          event_type: string;
          payload?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          event_type?: string;
          payload?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Untyped client — avoids Supabase v2 type inference conflicts with .update()/.insert()
// The Database interface above is kept for reference and IntelliSense on .from() selects
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to set player context for RLS
export function setPlayerContext(sessionToken: string, playerId: string, teamId?: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('player_session_token', sessionToken);
    localStorage.setItem('player_id', playerId);
    if (teamId) {
      localStorage.setItem('team_id', teamId);
    }
  }
}

// Helper to get player context from storage
export function getPlayerContext() {
  if (typeof window !== 'undefined') {
    return {
      sessionToken: localStorage.getItem('player_session_token'),
      playerId: localStorage.getItem('player_id'),
      teamId: localStorage.getItem('team_id'),
    };
  }
  return { sessionToken: null, playerId: null, teamId: null };
}

// Clear player context
export function clearPlayerContext() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('player_session_token');
    localStorage.removeItem('player_id');
    localStorage.removeItem('team_id');
  }
}
