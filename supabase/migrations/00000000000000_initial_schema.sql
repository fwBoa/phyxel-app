-- Enable RLS on all tables

-- Profiles (extension of auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT CHECK (role IN ('brand', 'host')) NOT NULL,
  brand_name  TEXT,
  website     TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read access to profiles
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_owner_update" ON profiles
  FOR UPDATE
  TO authenticated
  USING ( (select auth.uid()) = id )
  WITH CHECK ( (select auth.uid()) = id );

-- Users can delete their own profile
CREATE POLICY "profiles_owner_delete" ON profiles
  FOR DELETE
  TO authenticated
  USING ( (select auth.uid()) = id );

-- Spaces (physical venues)
CREATE TABLE spaces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  type         TEXT CHECK (type IN ('showroom', 'popup', 'corner', 'gallery', 'boutique')) NOT NULL,
  city         TEXT NOT NULL,
  district     TEXT,
  address      TEXT,
  area_sqm     INTEGER,
  price_day    DECIMAL(10,2) NOT NULL,
  description  TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Public read access to spaces
CREATE POLICY "spaces_public_read" ON spaces
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Hosts can insert their own spaces
CREATE POLICY "spaces_host_insert" ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK ( (select auth.uid()) = host_id );

-- Hosts can update their own spaces
CREATE POLICY "spaces_host_update" ON spaces
  FOR UPDATE
  TO authenticated
  USING ( (select auth.uid()) = host_id )
  WITH CHECK ( (select auth.uid()) = host_id );

-- Hosts can delete their own spaces
CREATE POLICY "spaces_host_delete" ON spaces
  FOR DELETE
  TO authenticated
  USING ( (select auth.uid()) = host_id );

-- Space photos
CREATE TABLE space_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id   UUID REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  url        TEXT NOT NULL,
  is_cover   BOOLEAN DEFAULT FALSE,
  order_idx  INTEGER DEFAULT 0
);

ALTER TABLE space_photos ENABLE ROW LEVEL SECURITY;

-- Public read access to space photos
CREATE POLICY "space_photos_public_read" ON space_photos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Hosts can manage photos for their spaces
CREATE POLICY "space_photos_host_manage" ON space_photos
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM spaces
    WHERE spaces.id = space_photos.space_id
    AND spaces.host_id = (select auth.uid())
  ));

-- Bookings
CREATE TABLE bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    UUID REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  brand_id    UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view bookings they are involved in
CREATE POLICY "bookings_participant_read" ON bookings
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = brand_id
    OR EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = bookings.space_id
      AND spaces.host_id = (select auth.uid())
    )
  );

-- Brands can create bookings
CREATE POLICY "bookings_brand_insert" ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK ( (select auth.uid()) = brand_id );

-- Brands can cancel their own bookings, hosts can update status
CREATE POLICY "bookings_participant_update" ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = brand_id
    OR EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = bookings.space_id
      AND spaces.host_id = (select auth.uid())
    )
  )
  WITH CHECK (
    (select auth.uid()) = brand_id
    OR EXISTS (
      SELECT 1 FROM spaces
      WHERE spaces.id = bookings.space_id
      AND spaces.host_id = (select auth.uid())
    )
  );

-- Function: create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'brand')
  );
  RETURN new;
END;
$$;

-- Trigger: create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: calculate total price for booking
CREATE OR REPLACE FUNCTION public.calculate_booking_total()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  daily_price DECIMAL(10,2);
  num_days INTEGER;
BEGIN
  SELECT price_day INTO daily_price
  FROM public.spaces
  WHERE id = NEW.space_id;

  num_days := NEW.end_date - NEW.start_date + 1;
  NEW.total_price := daily_price * num_days;

  RETURN NEW;
END;
$$;

-- Trigger: calculate total price before insert
CREATE OR REPLACE TRIGGER calculate_booking_total_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_booking_total();
