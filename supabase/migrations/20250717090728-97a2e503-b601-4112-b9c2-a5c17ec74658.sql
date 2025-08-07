
-- Create posts table for the dashboard
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[], -- Array of technologies used
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact submissions table with rate limiting
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  user_ip TEXT, -- To track rate limiting for non-authenticated users
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient rate limiting queries
CREATE INDEX idx_contact_submissions_email_created_at ON public.contact_submissions (email, created_at);
CREATE INDEX idx_contact_submissions_ip_created_at ON public.contact_submissions (user_ip, created_at);

-- Enable Row Level Security on both tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for posts (admin-only access for dashboard)
CREATE POLICY "Allow all operations on posts" 
  ON public.posts 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create policy for contact submissions with rate limiting
CREATE POLICY "Allow insert for contact submissions with rate limit" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (
    -- Allow if no submission from this email in the last 30 minutes
    NOT EXISTS (
      SELECT 1 FROM public.contact_submissions 
      WHERE email = NEW.email 
      AND created_at > (NOW() - INTERVAL '30 minutes')
    )
  );

CREATE POLICY "Allow read for contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for posts table
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON public.posts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check rate limit before insert
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has submitted in the last 30 minutes
  IF EXISTS (
    SELECT 1 FROM public.contact_submissions 
    WHERE email = NEW.email 
    AND created_at > (NOW() - INTERVAL '30 minutes')
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 30 minutes before submitting another message.';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for rate limiting
CREATE TRIGGER contact_rate_limit_trigger
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();
