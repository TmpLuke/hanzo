-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  transcript_url TEXT
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Tickets are viewable by everyone
CREATE POLICY "Tickets are viewable by everyone" 
ON public.tickets 
FOR SELECT 
USING (true);

-- Anyone can insert tickets
CREATE POLICY "Anyone can insert tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update tickets
CREATE POLICY "Anyone can update tickets" 
ON public.tickets 
FOR UPDATE 
USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_channel_id ON public.tickets(channel_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets(created_at DESC);
