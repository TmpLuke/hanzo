-- Add ticket_number column to tickets table
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS ticket_number INTEGER;

-- Create index for ticket numbers
CREATE INDEX IF NOT EXISTS idx_tickets_number ON public.tickets(ticket_number);
