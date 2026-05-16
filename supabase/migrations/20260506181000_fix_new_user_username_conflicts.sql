/*
  # Make new-user profile creation resilient to username collisions

  Supabase Auth reports "Database error saving new user" when the
  on_auth_user_created trigger fails. The previous trigger inserted
  raw_user_meta_data->>'username' directly into public.profiles, which
  violates UNIQUE(username) whenever two users share the same username
  (for example, identical email local-parts across domains).
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  candidate_username text;
BEGIN
  base_username := COALESCE(
    NULLIF(trim(new.raw_user_meta_data->>'username'), ''),
    NULLIF(split_part(COALESCE(new.email, ''), '@', 1), ''),
    'user'
  );

  candidate_username := left(lower(base_username), 24);

  WHILE EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.username = candidate_username
  ) LOOP
    candidate_username := left(lower(base_username), 18)
      || '_'
      || right(replace(new.id::text, '-', ''), 5);
    EXIT;
  END LOOP;

  INSERT INTO public.profiles (id, username)
  VALUES (new.id, candidate_username);

  RETURN new;
END;
$$;
