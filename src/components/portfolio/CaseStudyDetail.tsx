'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import CardEnhanced from '../ui/CardEnhanced';
import LazyImage from '../ui/LazyImage';

interface CaseStudyData {
  id: number;
  title: string;
  description: string;
  industry: string;
  serviceType: string;
  projectSize: string;
  image: string;
  challenge: string;
  solution: string;
  techStack: string[];
  results: string[];
  clientReview?: {
    content: string;
    author: string;
    rating: number;
  };
  architectureDiagram: string;
  screenshots: string[];
  timeline: string;
  teamSize: string;
  budget: string;
}

interface CaseStudyDetailProps {
  project: CaseStudyData;
}

const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({ project }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-accent/5 dark:from-gray-900 dark:via-gray-800 dark:to-accent/10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                {project.industry}
              </span>
              <span className="px-4 py-2 bg-accent-orange/10 text-accent-orange rounded-full text-sm font-medium">
                {project.serviceType}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-accent-orange bg-clip-text text-transparent">
              {project.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{project.timeline}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{project.teamSize}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Team Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{project.projectSize}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Project Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">{project.budget}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Budget</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {/* Problem Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    The Problem
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
                <div className="relative">
                  <LazyImage
                    src={project.image}
                    alt={`${project.title} - Problem`}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                    BEFORE
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Solution Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative">
                  <LazyImage
                    src={project.screenshots[0] || project.image}
                    alt={`${project.title} - Solution`}
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                    AFTER
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    Our Solution
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {project.solution}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Architecture Diagram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                Architecture Overview
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <LazyImage
                  src={project.architectureDiagram}
                  alt={`${project.title} - Architecture Diagram`}
                  width={800}
                  height={400}
                  className="w-full rounded-xl"
                />
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                Technology Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.techStack.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-accent/10 to-accent-orange/10 dark:from-accent/20 dark:to-accent-orange/20 p-4 rounded-xl text-center"
                  >
                    <div className="text-lg font-semibold text-accent mb-1">{tech}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                Results & Impact
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CardEnhanced
                      variant="elevated"
                      hover="lift"
                      className="p-6 text-center h-full"
                    >
                      <Icons.CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-700 dark:text-gray-300">{result}</p>
                    </CardEnhanced>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Screenshots Gallery */}
            {project.screenshots.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                  Screenshots & Mockups
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.screenshots.map((screenshot, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <LazyImage
                        src={screenshot}
                        alt={`${project.title} - Screenshot ${index + 1}`}
                        width={400}
                        height={300}
                        className="rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Client Review */}
            {project.clientReview && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                  Client Testimonial
                </h2>
                <CardEnhanced variant="elevated" className="p-8 text-center max-w-4xl mx-auto">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icons.Star
                        key={i}
                        className={`w-6 h-6 ${i < project.clientReview!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                    "{project.clientReview.content}"
                  </blockquote>
                  <cite className="text-accent font-semibold">— {project.clientReview.author}</cite>
                </CardEnhanced>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Let's discuss how we can help you achieve similar results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your Project
                </Link>
                <Link
                  href="/portfolio"
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  View More Projects
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;
