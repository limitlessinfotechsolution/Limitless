import { Metadata } from 'next';
import { supabase } from '../../../src/lib/supabaseClient';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!supabase) {
    return {
      title: 'Project Not Found - Limitless Infotech',
    };
  }

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!project) {
    return {
      title: 'Project Not Found - Limitless Infotech',
    };
  }

  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack.filter((item): item is string => typeof item === 'string') : [];

  const title = typeof project.title === 'string' ? project.title : 'Project';
  const description = typeof project.description === 'string' ? project.description : 'No description available';
  const industry = typeof project.industry === 'string' ? project.industry : 'Unknown';
  const serviceType = typeof project.service_type === 'string' ? project.service_type : 'Unknown';
  const image = typeof project.image === 'string' ? project.image : '';

  return {
    title: `${title} - Case Study | Limitless Infotech`,
    description,
    keywords: ['case study', industry, serviceType, ...techStack],
    openGraph: {
      title: `${title} - Case Study`,
      description,
      images: image ? [image] : [],
    },
  };
}
