-- Create admin_users table to store admin usernames
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Anyone can read admin_users to check if they're admin
CREATE POLICY "Anyone can view admin users"
ON public.admin_users
FOR SELECT
USING (true);

-- Create custom_events table for admin-managed events
CREATE TABLE public.custom_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  banner TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  details TEXT,
  link TEXT,
  event_type TEXT NOT NULL DEFAULT 'event',
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.custom_events ENABLE ROW LEVEL SECURITY;

-- Anyone can view custom events
CREATE POLICY "Anyone can view custom events"
ON public.custom_events
FOR SELECT
USING (true);

-- Anyone can insert (we'll check admin status in the app)
CREATE POLICY "Anyone can insert custom events"
ON public.custom_events
FOR INSERT
WITH CHECK (true);

-- Anyone can update custom events
CREATE POLICY "Anyone can update custom events"
ON public.custom_events
FOR UPDATE
USING (true);

-- Anyone can delete custom events
CREATE POLICY "Anyone can delete custom events"
ON public.custom_events
FOR DELETE
USING (true);

-- Insert default admin user
INSERT INTO public.admin_users (username) VALUES ('admin');