-- Create gardens table
CREATE TABLE gardens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid REFERENCES auth.users (id) NOT NULL,
  title text NOT NULL,
  reveal_date date NOT NULL,
  is_locked boolean DEFAULT TRUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own gardens"
ON gardens FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can view their own gardens"
ON gardens FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own gardens"
ON gardens FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own gardens"
ON gardens FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);
