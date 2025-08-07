-- Add slug column to posts table
ALTER TABLE public.posts ADD COLUMN slug TEXT;

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Create function to ensure unique slug
CREATE OR REPLACE FUNCTION public.ensure_unique_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base slug from title
  base_slug := public.generate_slug(NEW.title);
  final_slug := base_slug;
  
  -- Check if slug exists and increment until unique
  WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = final_slug AND id != NEW.id) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
CREATE TRIGGER generate_post_slug
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_unique_slug();

-- Update existing posts to have slugs
UPDATE public.posts SET slug = public.generate_slug(title) WHERE slug IS NULL;

-- Make slug column required and unique
ALTER TABLE public.posts ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX posts_slug_unique ON public.posts(slug);