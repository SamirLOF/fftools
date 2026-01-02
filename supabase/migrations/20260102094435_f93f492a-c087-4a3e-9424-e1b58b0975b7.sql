-- Create table to store event history
CREATE TABLE public.event_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  banner TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  details TEXT,
  link TEXT,
  event_type VARCHAR(20) NOT NULL DEFAULT 'event', -- 'event' or 'update'
  removed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX idx_event_history_unique ON public.event_history(region, title, banner, start_date, end_date);

-- Create index for faster region-based queries
CREATE INDEX idx_event_history_region ON public.event_history(region);

-- Create index for search
CREATE INDEX idx_event_history_title_search ON public.event_history USING gin(to_tsvector('english', title));

-- Enable Row Level Security
ALTER TABLE public.event_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read history (public data)
CREATE POLICY "Anyone can view event history" 
ON public.event_history 
FOR SELECT 
USING (true);

-- Allow anyone to insert into history (for tracking removed events)
CREATE POLICY "Anyone can insert event history" 
ON public.event_history 
FOR INSERT 
WITH CHECK (true);