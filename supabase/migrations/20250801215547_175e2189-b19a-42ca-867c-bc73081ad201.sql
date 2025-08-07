-- Add ip_address column to contact_submissions table
ALTER TABLE public.contact_submissions 
ADD COLUMN ip_address INET;

-- Update the rate limiting function to check by IP address
CREATE OR REPLACE FUNCTION public.check_contact_submission_rate_limit_by_ip(user_ip INET)
RETURNS BOOLEAN AS $$
DECLARE
  last_submission_time TIMESTAMP WITH TIME ZONE;
  rate_limit_minutes INTEGER := 5; -- 5 minute rate limit
BEGIN
  -- Get the most recent submission time for this IP
  SELECT created_at INTO last_submission_time
  FROM public.contact_submissions
  WHERE ip_address = user_ip
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

-- Update the INSERT policy to use IP-based rate limiting
DROP POLICY IF EXISTS "Anyone can submit contact forms with rate limiting" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact forms with IP rate limiting" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (public.check_contact_submission_rate_limit_by_ip(ip_address));

-- Update the validation function for IP-based rate limiting
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.check_contact_submission_rate_limit_by_ip(NEW.ip_address) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 5 minutes before submitting another message.'
      USING ERRCODE = 'P0001';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;