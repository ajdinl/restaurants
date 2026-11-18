-- unaccent() is only STABLE, so it cannot back an index or a generated column. Pinning the dictionary
-- makes the result depend on the input alone, which lets us declare this wrapper IMMUTABLE.
CREATE OR REPLACE FUNCTION f_unaccent(text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE PARALLEL SAFE STRICT
AS $$
  SELECT public.unaccent('public.unaccent'::regdictionary, $1)
$$;
