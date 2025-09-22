import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the SQL file with sample data
const sqlFilePath = join(__dirname, '..', 'complete_supabase_setup_enhanced.sql');
const outputPath = join(__dirname, '..', 'complete_supabase_setup_production.sql');

try {
  // Read the SQL file
  const data = readFileSync(sqlFilePath, 'utf8');

  // Replace sample data with "updating soon" placeholders
  let updatedData = data;

  // Replace service data
  const serviceRegex = /INSERT INTO public\.services \(title, slug, description, benefits, features, technologies, icon, link, is_featured\) VALUES[\s\S]*?ON CONFLICT \(slug\) DO NOTHING;/;
  updatedData = updatedData.replace(
    serviceRegex,
    `-- PRODUCTION PLACEHOLDER
-- Services data will be updated soon
INSERT INTO public.services (title, slug, description, benefits, features, technologies, icon, link, is_featured) VALUES
('Services Updating Soon', 'updating-soon', 'Our comprehensive service offerings are being updated. Please check back soon for detailed information.', 'Exceptional service quality and innovative solutions', '["Service 1", "Service 2", "Service 3"]', '["Technology 1", "Technology 2", "Technology 3"]', 'Clock', '/services#updating-soon', true)
ON CONFLICT (slug) DO NOTHING;`
  );

  // Replace team member data
  const teamRegex = /INSERT INTO public\.team_members \(name, slug, role, bio, image, is_featured\) VALUES[\s\S]*?ON CONFLICT \(slug\) DO NOTHING;/;
  updatedData = updatedData.replace(
    teamRegex,
    `-- PRODUCTION PLACEHOLDER
-- Team member data will be updated soon
INSERT INTO public.team_members (name, slug, role, bio, image, is_featured) VALUES
('Team Information Updating Soon', 'updating-soon', 'Our Team', 'Information about our talented team members will be available soon. We are a group of dedicated professionals committed to delivering exceptional results.', '/images/placeholders/team-updating-soon.jpg', true)
ON CONFLICT (slug) DO NOTHING;`
  );

  // Replace FAQ data
  const faqRegex = /INSERT INTO public\.faqs \(question, answer, category, is_featured\) VALUES[\s\S]*?ON CONFLICT DO NOTHING;/;
  updatedData = updatedData.replace(
    faqRegex,
    `-- PRODUCTION PLACEHOLDER
-- FAQ data will be updated soon
INSERT INTO public.faqs (question, answer, category, is_featured) VALUES
('When will the content be updated?', 'Our content is being updated and will be available soon. Please check back in a few days.', 'general', true),
('How can I contact you?', 'You can reach us through our contact page. We typically respond within 24 hours.', 'contact', true),
('What services do you offer?', 'We offer a range of technology services. Detailed information will be available soon.', 'services', false)
ON CONFLICT DO NOTHING;`
  );

  // Write the updated data to a new file
  writeFileSync(outputPath, updatedData, 'utf8');
  
  console.log('Successfully created production-ready SQL file with placeholder data');
  console.log('File saved as: complete_supabase_setup_production.sql');
} catch (error) {
  console.error('Error processing file:', error);
}