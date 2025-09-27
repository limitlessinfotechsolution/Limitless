'use client';

import React from 'react';
import { Users, Award, Target } from 'lucide-react';
import CardEnhanced from '@/components/ui/Card-enhanced';
import { Button } from '@/components/ui/Button';

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      bio: '10+ years of experience in software development and business leadership.',
      avatar: '',
      socialLinks: []
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'CTO',
      bio: 'Expert in cloud architecture and scalable system design.',
      avatar: '',
      socialLinks: []
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Lead Developer',
      bio: 'Full-stack developer with expertise in modern web technologies.',
      avatar: '',
      socialLinks: []
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'UX/UI Designer',
      bio: 'Creating beautiful and intuitive user experiences for 8+ years.',
      avatar: '',
      socialLinks: []
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'DevOps Engineer',
      bio: 'Specializing in CI/CD pipelines and infrastructure automation.',
      avatar: '',
      socialLinks: []
    },
    {
      id: 6,
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      bio: 'Driving growth through digital marketing strategies and brand development.',
      avatar: '',
      socialLinks: []
    }
  ];

  const values = [
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and collective intelligence.'
    },
    {
      icon: <Award className="w-8 h-8 text-accent" />,
      title: 'Excellence',
      description: 'We strive for excellence in every project and interaction.'
    },
    {
      icon: <Target className="w-8 h-8 text-accent" />,
      title: 'Innovation',
      description: 'We constantly push boundaries to deliver cutting-edge solutions.'
    }
  ];

  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="heading-xl mb-4">Our Team</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Meet the talented professionals who make our vision a reality. 
          Our diverse team brings together expertise from various fields to deliver exceptional results.
        </p>
      </div>

      {/* Company Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <CardEnhanced key={index} variant="elevated" className="text-center p-8">
              <div className="flex justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="heading-sm mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
            </CardEnhanced>
          ))}
      </div>

      {/* Team Members */}
      <div className="mb-16">
        <h2 className="heading-lg text-center mb-12">Meet Our Experts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <CardEnhanced key={member.id} variant="outlined" className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <h3 className="heading-sm mb-1">{member.name}</h3>
              <p className="text-accent font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
              <Button variant="outline" size="sm">View Profile</Button>
            </CardEnhanced>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <CardEnhanced variant="gradient" className="text-center p-12">
        <h2 className="heading-lg mb-4">Join Our Team</h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          We're always looking for talented individuals to join our growing team.
          Check out our career opportunities and become part of something amazing.
        </p>
        <Button variant="primary" size="lg">
          View Career Opportunities
        </Button>
      </CardEnhanced>
    </div>
  );
}