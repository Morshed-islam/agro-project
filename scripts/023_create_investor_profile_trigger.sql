-- Function to auto-create investor profile when admin creates an investor account
CREATE OR REPLACE FUNCTION public.handle_new_investor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile if user metadata indicates this is an investor
  IF NEW.raw_user_meta_data->>'role' = 'investor' THEN
    INSERT INTO public.investor_profiles (id, investor_name, email, phone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'investor_name', NEW.email),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_investor_user_created ON auth.users;

CREATE TRIGGER on_investor_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_investor();

COMMENT ON FUNCTION public.handle_new_investor() IS 'Auto-creates investor profile when admin creates investor account';
