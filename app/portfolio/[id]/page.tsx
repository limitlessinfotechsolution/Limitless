import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '../../../src/lib/supabaseClient';
import CaseStudyDetail from '../../../src/components/portfolio/CaseStudyDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', parseInt(params.id))
    .single();

  if (!project) {
    return {
      title: 'Project Not Found - Limitless Infotech',
    };
  }

  return {
    title: `${project.title} - Case Study | Limitless Infotech`,
    description: project.description,
    keywords: ['case study', project.industry, project.service_type, ...project.tech_stack],
    openGraph: {
      title: `${project.title} - Case Study`,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', parseInt(params.id))
    .single();

  if (error || !project) {
    notFound();
  }

  // Map database fields to component props
  const caseStudyData = {
    id: project.id,
    title: project.title,
    description: project.description,
    industry: project.industry,
    serviceType: project.service_type,
    projectSize: project.project_size,
    image: project.image,
    challenge: project.challenge,
    solution: project.solution,
    techStack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
    results: Array.isArray(project.results) ? project.results : [],
    clientReview: project.client_review ? {
      content: typeof project.client_review === 'string' ? project.client_review : '',
      author: project.client_name || 'Client',
      rating: 5
    } : undefined,
    // Add placeholders for additional fields
    architectureDiagram: project.architecture_diagram || '/images/architecture-placeholder.svg',
    screenshots: project.screenshots || [project.image],
    timeline: project.timeline || '3 months',
    teamSize: project.team_size || '5 developers',
    budget: project.budget || 'Contact for details',
  };

  return <CaseStudyDetail project={caseStudyData} />;
}
