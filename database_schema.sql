-- Cat Care Tracker Database Schema
-- Run this entire script in your Supabase SQL Editor

-- ============================================================================
-- TABLES
-- ============================================================================

-- Households table for data isolation
CREATE TABLE households (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'pending' CHECK (role IN ('admin', 'user', 'pending')),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feeding events table
CREATE TABLE feeding_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  food_type TEXT NOT NULL,
  fed_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom events table (includes litter cleaning and all other care events)
CREATE TABLE custom_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES households(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predefined event types for consistency
CREATE TABLE event_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system_defined BOOLEAN DEFAULT FALSE
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================

CREATE INDEX idx_feeding_events_household ON feeding_events(household_id);
CREATE INDEX idx_feeding_events_created_at ON feeding_events(created_at DESC);
CREATE INDEX idx_custom_events_household ON custom_events(household_id);
CREATE INDEX idx_custom_events_type ON custom_events(event_type);
CREATE INDEX idx_custom_events_created_at ON custom_events(created_at DESC);
CREATE INDEX idx_profiles_household ON profiles(household_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view household members" ON profiles
  FOR SELECT USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Households policies
CREATE POLICY "Users can view own household" ON households
  FOR SELECT USING (
    id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

-- Feeding events policies
CREATE POLICY "Users can view household feeding events" ON feeding_events
  FOR SELECT USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create feeding events" ON feeding_events
  FOR INSERT WITH CHECK (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update household feeding events" ON feeding_events
  FOR UPDATE USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete household feeding events" ON feeding_events
  FOR DELETE USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

-- Custom events policies
CREATE POLICY "Users can view household custom events" ON custom_events
  FOR SELECT USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create custom events" ON custom_events
  FOR INSERT WITH CHECK (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update household custom events" ON custom_events
  FOR UPDATE USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete household custom events" ON custom_events
  FOR DELETE USING (
    household_id = (SELECT household_id FROM profiles WHERE id = auth.uid())
  );

-- Event types policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view event types" ON event_types
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically create a household and profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_household_id UUID;
BEGIN
  -- Create a new household for the user
  INSERT INTO public.households (name)
  VALUES (NEW.email || '''s Household')
  RETURNING id INTO new_household_id;

  -- Create the user profile
  INSERT INTO public.profiles (id, email, full_name, role, household_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin', -- First user is admin
    new_household_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_feeding_events
  BEFORE UPDATE ON feeding_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_custom_events
  BEFORE UPDATE ON custom_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert predefined event types
INSERT INTO event_types (name, description, is_system_defined) VALUES
  ('Litter Cleaning', 'Litter box cleaning and maintenance', TRUE),
  ('Vet Visit', 'Veterinary appointments and checkups', TRUE),
  ('Medication', 'Medicine administration', TRUE),
  ('Grooming', 'Brushing, bathing, nail trimming', TRUE),
  ('Behavioral Note', 'Unusual behavior observations', TRUE),
  ('Playtime', 'Interactive play sessions', TRUE),
  ('Weight Check', 'Weight monitoring', TRUE)
ON CONFLICT (name) DO NOTHING;
