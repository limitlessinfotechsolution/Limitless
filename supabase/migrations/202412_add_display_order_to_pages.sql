-- Add display_order column to pages table for drag-and-drop functionality
ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add constraint to ensure display_order is non-negative
ALTER TABLE public.pages
ADD CONSTRAINT pages_display_order_positive CHECK (display_order >= 0);

-- Create index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON public.pages(display_order);

-- Update existing pages with sequential display_order values
UPDATE public.pages
SET display_order = sub.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as row_num
  FROM public.pages
) sub
WHERE public.pages.id = sub.id;
