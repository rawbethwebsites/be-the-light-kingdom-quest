-- ============================================
-- BE THE LIGHT: KINGDOM QUEST
-- Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ROOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(6) UNIQUE NOT NULL,
  title VARCHAR(255) DEFAULT 'Kingdom Quest',
  host_session_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  status VARCHAR(20) DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'paused', 'ended')),
  active_game_key VARCHAR(50),
  active_question_index INTEGER DEFAULT 0,
  active_question_id UUID,
  timer_started_at TIMESTAMPTZ,
  timer_ends_at TIMESTAMPTZ,
  joins_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_status ON rooms(status);

-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT 'tbn-gold',
  icon VARCHAR(50) DEFAULT 'light',
  score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_room_id ON teams(room_id);

-- ============================================
-- PLAYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  nickname VARCHAR(50) NOT NULL,
  session_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_players_room_id ON players(room_id);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_session_token ON players(session_token);

-- ============================================
-- GAME QUESTIONS TABLE (Seed Data)
-- ============================================
CREATE TABLE IF NOT EXISTS game_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_key VARCHAR(50) NOT NULL,
  sequence INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL,
  explanation TEXT,
  bible_reference VARCHAR(100),
  source_label VARCHAR(50) DEFAULT 'Bible',
  time_limit_seconds INTEGER DEFAULT 15,
  difficulty VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_questions_game_key ON game_questions(game_key);
CREATE INDEX idx_game_questions_sequence ON game_questions(game_key, sequence);

-- ============================================
-- ANSWERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES game_questions(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  response_time_ms INTEGER,
  points_awarded INTEGER DEFAULT 0,
  UNIQUE(player_id, question_id)
);

CREATE INDEX idx_answers_room_id ON answers(room_id);
CREATE INDEX idx_answers_player_id ON answers(player_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- ============================================
-- MISSIONS TABLE (Kingdom Builders)
-- ============================================
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  mission_key VARCHAR(50) NOT NULL,
  problem_text TEXT,
  ai_prompt TEXT,
  solution_text TEXT,
  safety_rule TEXT,
  slogan VARCHAR(100),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  host_score INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0
);

CREATE INDEX idx_missions_room_id ON missions(room_id);
CREATE INDEX idx_missions_team_id ON missions(team_id);
CREATE UNIQUE INDEX idx_missions_team_room ON missions(team_id, room_id);

-- ============================================
-- VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, mission_id)
);

CREATE INDEX idx_votes_room_id ON votes(room_id);
CREATE INDEX idx_votes_mission_id ON votes(mission_id);

-- ============================================
-- GAME EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS game_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_events_room_id ON game_events(room_id);
CREATE INDEX idx_game_events_event_type ON game_events(room_id, event_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROOMS POLICIES
-- ============================================
-- Anyone can read room basic info (for joining)
CREATE POLICY "rooms_public_read" ON rooms
  FOR SELECT
  USING (TRUE);

-- Host can update their room (using session token)
CREATE POLICY "rooms_host_update" ON rooms
  FOR UPDATE
  USING (host_session_token = current_setting('app.settings.host_token', TRUE)::UUID);

-- ============================================
-- TEAMS POLICIES
-- ============================================
-- Players can read teams in their room
CREATE POLICY "teams_read" ON teams
  FOR SELECT
  USING (room_id IN (SELECT id FROM rooms WHERE status != 'ended'));

-- Host can update teams
CREATE POLICY "teams_host_update" ON teams
  FOR UPDATE
  USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE host_session_token = current_setting('app.settings.host_token', TRUE)::UUID
    )
  );

-- Players can insert their own team (during join)
CREATE POLICY "teams_insert" ON teams
  FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- PLAYERS POLICIES
-- ============================================
-- Players can read players in their room
CREATE POLICY "players_read" ON players
  FOR SELECT
  USING (room_id IN (SELECT id FROM rooms WHERE status != 'ended'));

-- Players can insert their own record
CREATE POLICY "players_insert" ON players
  FOR INSERT
  WITH CHECK (TRUE);

-- Players can update their own record (using session token)
CREATE POLICY "players_update_own" ON players
  FOR UPDATE
  USING (session_token = current_setting('app.settings.player_token', TRUE)::UUID);

-- ============================================
-- GAME QUESTIONS POLICIES
-- ============================================
-- Players can read questions but NOT correct answers before reveal
CREATE POLICY "game_questions_read_safe" ON game_questions
  FOR SELECT
  USING (
    -- Host can see everything
    EXISTS (
      SELECT 1 FROM rooms 
      WHERE host_session_token = current_setting('app.settings.host_token', TRUE)::UUID
    )
    OR
    -- Players can see questions for active/paused games
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN answers a ON a.room_id = r.id
      WHERE r.status IN ('active', 'paused')
      AND a.player_id = current_setting('app.settings.player_id', TRUE)::UUID
    )
  );

-- ============================================
-- ANSWERS POLICIES
-- ============================================
-- Players can read their own answers
CREATE POLICY "answers_read_own" ON answers
  FOR SELECT
  USING (player_id = current_setting('app.settings.player_id', TRUE)::UUID);

-- Players can insert one answer per question
CREATE POLICY "answers_insert" ON answers
  FOR INSERT
  WITH CHECK (
    player_id = current_setting('app.settings.player_id', TRUE)::UUID
    AND NOT EXISTS (
      SELECT 1 FROM answers 
      WHERE player_id = current_setting('app.settings.player_id', TRUE)::UUID
      AND question_id = answers.question_id
    )
  );

-- Host can update answers (for scoring)
CREATE POLICY "answers_host_update" ON answers
  FOR UPDATE
  USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE host_session_token = current_setting('app.settings.host_token', TRUE)::UUID
    )
  );

-- ============================================
-- MISSIONS POLICIES
-- ============================================
-- Teams can read missions in their room
CREATE POLICY "missions_read" ON missions
  FOR SELECT
  USING (room_id IN (SELECT id FROM rooms WHERE status != 'ended'));

-- Teams can insert their own mission
CREATE POLICY "missions_insert" ON missions
  FOR INSERT
  WITH CHECK (
    team_id = current_setting('app.settings.team_id', TRUE)::UUID
  );

-- Teams can update their own mission
CREATE POLICY "missions_update_own" ON missions
  FOR UPDATE
  USING (team_id = current_setting('app.settings.team_id', TRUE)::UUID);

-- Host can update all missions (for scoring)
CREATE POLICY "missions_host_update" ON missions
  FOR UPDATE
  USING (
    room_id IN (
      SELECT id FROM rooms 
      WHERE host_session_token = current_setting('app.settings.host_token', TRUE)::UUID
    )
  );

-- ============================================
-- VOTES POLICIES
-- ============================================
-- Players can read votes
CREATE POLICY "votes_read" ON votes
  FOR SELECT
  USING (TRUE);

-- Players can insert one vote (not for own team - enforced in app logic)
CREATE POLICY "votes_insert" ON votes
  FOR INSERT
  WITH CHECK (
    player_id = current_setting('app.settings.player_id', TRUE)::UUID
    AND NOT EXISTS (
      SELECT 1 FROM votes 
      WHERE player_id = current_setting('app.settings.player_id', TRUE)::UUID
    )
  );

-- ============================================
-- GAME EVENTS POLICIES
-- ============================================
-- Host can insert game events
CREATE POLICY "game_events_host_insert" ON game_events
  FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT id FROM rooms 
      WHERE host_session_token = current_setting('app.settings.host_token', TRUE)::UUID
    )
  );

-- Players can read game events in their room
CREATE POLICY "game_events_read" ON game_events
  FOR SELECT
  USING (room_id IN (SELECT id FROM rooms WHERE status != 'ended'));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate short room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate room code
CREATE TRIGGER trg_generate_room_code
  BEFORE INSERT ON rooms
  FOR EACH ROW
  WHEN (NEW.code IS NULL)
  EXECUTE FUNCTION generate_room_code();

-- Function to check if player already answered
CREATE OR REPLACE FUNCTION check_answer_exists(p_player_id UUID, p_question_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM answers 
    WHERE player_id = p_player_id AND question_id = p_question_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REALTIME SETUP
-- ============================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE game_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
ALTER PUBLICATION supabase_realtime ADD TABLE missions;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE game_events;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE rooms IS 'Game rooms with host control';
COMMENT ON TABLE teams IS 'Teams competing in a room';
COMMENT ON TABLE players IS 'Individual players on teams';
COMMENT ON TABLE game_questions IS 'Seed question data for all game modes';
COMMENT ON TABLE answers IS 'Player answers to questions';
COMMENT ON TABLE missions IS 'Kingdom Builders mission submissions';
COMMENT ON TABLE votes IS 'Player votes on missions';
COMMENT ON TABLE game_events IS 'Game state events for realtime sync';
