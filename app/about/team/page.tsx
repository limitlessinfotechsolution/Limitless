'use client';
import { Users, Award, Target, Linkedin, Github, Twitter, Dribbble } from 'lucide-react';
import CardEnhanced from '@/components/ui/CardEnhanced';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: 'Faisal Khan',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 12+ years in technology and business development. Founded Limitless Infotech to bridge the gap between innovative technology and business needs. Expert in digital transformation strategies and scaling tech startups.',
      avatar: '/assets/team/faisal.jpg',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/faisalarzookhan' },
        { platform: 'twitter', url: 'https://twitter.com/faisalarzookhan' },
        { platform: 'github', url: 'https://github.com/faisalarzookhan' }
      ]
    },
    {
      id: 2,
      name: 'Taj Nadaf',
      role: 'CO-Founder & CTO',
      bio: '6+ years in software architecture and cloud solutions. Leads our technical innovation initiatives, specializing in scalable enterprise systems, AI integration, and modern development practices.',
      avatar: '',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/' },
        { platform: 'github', url: 'https://github.com/' }
      ]
    },
    {
      id: 3,
      name: 'Vinit Domitie',
      role: 'Backend Developer',
      bio: '10+ years crafting robust web applications. Expert in React, Node.js, and cloud-native development. Passionate about clean code, performance optimization, and mentoring junior developers.',
      avatar: '',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/' },
        { platform: 'github', url: 'https://github.com/' }
      ]
    },

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
            <CardEnhanced key={member.id} variant="outlined" className="text-center p-6">
              <div className="flex justify-center mb-4">
                {member.avatar ? (
                  <Image
                    src={member.avatar}
                    alt={`${member.name} photo`}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-accent"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="heading-sm mb-1">{member.name}</h3>
              <p className="text-accent font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">{member.bio}</p>

              {/* Social Links */}
              {member.socialLinks && member.socialLinks.length > 0 && (
                <div className="flex justify-center space-x-3 mb-4">
                  {member.socialLinks.map((social, index) => {
                    const getIcon = (platform: string) => {
                      switch (platform) {
                        case 'linkedin':
                          return <Linkedin className="w-4 h-4" />;
                        case 'github':
                          return <Github className="w-4 h-4" />;
                        case 'twitter':
                          return <Twitter className="w-4 h-4" />;
                        case 'dribbble':
                          return <Dribbble className="w-4 h-4" />;
                        default:
                          return <Users className="w-4 h-4" />;
                      }
                    };

                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                        aria-label={`${member.name} on ${social.platform}`}
                      >
                        {getIcon(social.platform)}
                      </a>
                    );
                  })}
                </div>
              )}

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