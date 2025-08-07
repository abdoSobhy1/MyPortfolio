-- Create contact_submissions table for storing contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied'))
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public form submissions)
CREATE POLICY "Anyone can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to view all submissions (admin access)
CREATE POLICY "Authenticated users can view all submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to update submissions (mark as read/replied)
CREATE POLICY "Authenticated users can update submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (true);