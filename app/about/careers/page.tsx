'use client';

import React from 'react';
import { Briefcase, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CareersPage() {
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-accent" />,
      title: 'Competitive Salary',
      description: 'We offer market-leading compensation packages.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-accent" />,
      title: 'Growth Opportunities',
      description: 'Continuous learning and career advancement paths.'
    },
    {
      icon: <Calendar className="w-8 h-8 text-accent" />,
      title: 'Flexible Schedule',
      description: 'Work-life balance with flexible working hours.'
    },
    {
      icon: <Briefcase className="w-8 h-8 text-accent" />,
      title: 'Remote Work',
      description: 'Option to work remotely or from our modern offices.'
    }
  ];

  const openPositions = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time'
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time'
    },
    {
      id: 4,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time'
    }
  ];

  return (
    <div className="container-custom py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="heading-xl mb-4">Join Our Team</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Be part of a dynamic team that's shaping the future of technology. 
          We offer exciting challenges, growth opportunities, and a collaborative work environment.
        </p>
      </div>

      {/* Why Work With Us */}
      <div className="mb-16">
        <h2 className="heading-lg text-center mb-12">Why Limitless Infotech?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} variant="elevated" className="text-center p-6">
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="heading-sm mb-2">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-16">
        <h2 className="heading-lg text-center mb-12">Open Positions</h2>
        <div className="space-y-4">
          {openPositions.map((position) => (
            <Card key={position.id} variant="outlined" className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="heading-md mb-1">{position.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">
                      {position.department}
                    </span>
                    <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {position.location}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                      {position.type}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button variant="primary">Apply Now</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Process */}
      <Card variant="gradient" className="p-8 mb-16">
        <h2 className="heading-lg text-center mb-6">Our Hiring Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto mb-3">
              <span className="text-accent font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-1">Application</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Submit your resume and cover letter</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto mb-3">
              <span className="text-accent font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-1">Screening</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Initial phone/video interview</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto mb-3">
              <span className="text-accent font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-1">Technical Interview</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Skills assessment and coding challenges</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center mx-auto mb-3">
              <span className="text-accent font-bold">4</span>
            </div>
            <h3 className="font-semibold mb-1">Offer</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Job offer and onboarding</p>
          </div>
        </div>
      </Card>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="heading-lg mb-4">Don't See a Perfect Fit?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          We're always looking for talented individuals. Send us your resume and we'll reach out when we have relevant opportunities.
        </p>
        <Button variant="primary" size="lg">
          Send Your Resume
        </Button>
      </div>
    </div>
  );
}