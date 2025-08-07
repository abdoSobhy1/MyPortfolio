-- Create a function to check rate limiting for contact form submissions
CREATE OR REPLACE FUNCTION public.check_contact_submission_rate_limit(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  last_submission_time TIMESTAMP WITH TIME ZONE;
  rate_limit_minutes INTEGER := 5; -- 5 minute rate limit
BEGIN
  -- Get the most recent submission time for this email
  SELECT created_at INTO last_submission_time
  FROM public.contact_submissions
  WHERE email = user_email
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no previous submission, allow it
  IF last_submission_time IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if enough time has passed
  IF EXTRACT(EPOCH FROM (NOW() - last_submission_time)) / 60 >= rate_limit_minutes THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the INSERT policy to include rate limiting
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact forms with rate limiting" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (public.check_contact_submission_rate_limit(email));

-- Create a custom error function for better error messages
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.check_contact_submission_rate_limit(NEW.email) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 5 minutes before submitting another message.'
      USING ERRCODE = 'P0001';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run validation before insert
DROP TRIGGER IF EXISTS validate_contact_submission_trigger ON public.contact_submissions;
CREATE TRIGGER validate_contact_submission_trigger
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_contact_submission();