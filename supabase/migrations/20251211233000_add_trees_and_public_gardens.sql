
-- Create trees table
CREATE TABLE IF NOT EXISTS trees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  garden_id uuid REFERENCES gardens (id) ON DELETE CASCADE NOT NULL,
  guest_name text NOT NULL,
  message_content text NOT NULL,
  tree_config jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;

-- Policy: UN-AUTHENTICATED users can INSERT trees (The invite system)
CREATE POLICY "Allow public insert (planting a tree)" 
ON trees 
FOR INSERT TO PUBLIC WITH CHECK (true);

-- Policy: Garden owner can view trees
CREATE POLICY "Garden owner can view trees"
ON trees
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gardens
    WHERE gardens.id = trees.garden_id
    AND gardens.owner_id = auth.uid()
  )
);

-- Policy: Allow public to view gardens (for sharing title)
-- Note: This makes all gardens readable by anyone who has the ID (or lists them).
-- This supersedes "Users can view their own gardens" for SELECT, but keeps other restrictions.
CREATE POLICY "Allow public view gardens"
ON gardens
FOR SELECT
TO PUBLIC
USING (true);
