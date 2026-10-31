-- Add slug column to portfolios table for public portfolio URLs
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);

-- Update existing portfolios to have a slug based on id (fallback)
UPDATE portfolios SET slug = 'portfolio-' || substr(id::text, 1, 8) WHERE slug IS NULL;
