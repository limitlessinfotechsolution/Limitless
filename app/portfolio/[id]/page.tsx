import { notFound } from 'next/navigation';
import { supabase } from '../../../src/lib/supabaseClient';
import CaseStudyDetail from '../../../src/components/portfolio/CaseStudyDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: PageProps) {
  if (!supabase) {
    notFound();
  }

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Map database fields to component props
  const caseStudyData = {
    id: typeof project.id === 'string' ? parseInt(project.id) : 0,
    title: typeof project.title === 'string' ? project.title : 'Project',
    description: typeof project.description === 'string' ? project.description : 'No description available',
    industry: typeof project.industry === 'string' ? project.industry : 'Unknown',
    serviceType: typeof project.service_type === 'string' ? project.service_type : 'Unknown',
    projectSize: typeof project.project_size === 'string' ? project.project_size : 'Medium',
    image: typeof project.image === 'string' ? project.image : '',
    challenge: typeof project.challenge === 'string' ? project.challenge : 'No challenge specified',
    solution: typeof project.solution === 'string' ? project.solution : 'No solution specified',
    techStack: Array.isArray(project.tech_stack) ? project.tech_stack.filter((item): item is string => typeof item === 'string') : [],
    results: Array.isArray(project.results) ? project.results.filter((item): item is string => typeof item === 'string') : [],
    clientReview: project.client_review ? {
      content: typeof project.client_review === 'string' ? project.client_review : '',
      author: 'Client',
      rating: 5
    } : undefined,
    architectureDiagram: '/images/architecture-placeholder.svg',
    screenshots: [typeof project.image === 'string' ? project.image : ''],
    timeline: '3 months',
    teamSize: '5 developers',
    budget: 'Contact for details',
  };

  return <CaseStudyDetail project={caseStudyData} />;
}
