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

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policy for posts (allow all operations since no auth is required)
CREATE POLICY "Allow all operations on posts" 
  ON public.posts 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

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