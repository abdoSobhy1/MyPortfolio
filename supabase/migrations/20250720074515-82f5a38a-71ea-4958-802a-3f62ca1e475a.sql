-- Create site_settings table for managing site-wide configuration
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_title text NOT NULL DEFAULT 'My Portfolio',
  site_description text DEFAULT 'A modern portfolio website',
  hero_title text DEFAULT 'Welcome to My Portfolio',
  hero_subtitle text DEFAULT 'I create amazing digital experiences',
  contact_email text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  about_content text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage site settings
CREATE POLICY "Authenticated users can manage site settings" 
ON public.site_settings 
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (site_title, site_description, hero_title, hero_subtitle, about_content)
VALUES (
  'My Portfolio',
  'A modern portfolio website showcasing my work and skills',
  'Welcome to My Portfolio',
  'I create amazing digital experiences',
  'I am a passionate developer with expertise in modern web technologies. I love creating beautiful, functional, and user-friendly applications.'
);