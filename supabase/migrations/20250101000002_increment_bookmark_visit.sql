-- Create RPC to atomically increment bookmark view_count and last_visited_at
CREATE OR REPLACE FUNCTION public.increment_bookmark_visit(
  p_bookmark_id bigint,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User id is required' USING ERRCODE = '23502';
  END IF;

  -- Ensure the caller matches the provided user id
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.bookmarks
  SET
    view_count = view_count + 1,
    last_visited_at = timezone('utc', now())
  WHERE id = p_bookmark_id
    AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bookmark not found or not owned by user' USING ERRCODE = 'P0002';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_bookmark_visit(bigint, uuid) TO authenticated, service_role;
