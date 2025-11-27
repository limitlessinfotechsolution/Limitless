'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';
import Team from '@/components/enterprise/Team';
import Skeleton from '@/components/ui/Skeleton';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
  performance?: number;
  projects?: number;
  joinDate: string;
}

import { TypedSupabaseClient } from '@/types';

async function fetchTeamMembers(supabase: TypedSupabaseClient): Promise<TeamMember[]> {
  // Fetch team members from Supabase (assume 'team_members' table with fields: id, name, role, email, phone, location, status, performance, projects, join_date, avatar_url)
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('join_date', { ascending: false });

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error('No team members found');
  }

  // Map data to TeamMember interface (convert join_date to string, etc.)
  return data.map((item) => ({
    ...item,
    phone: item.phone || '',
    location: item.location || 'Not provided',
    joinDate: new Date(item.join_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    avatar: item.avatar_url ? supabase.storage.from('avatars').getPublicUrl(item.avatar_url).data.publicUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0D8ABC&color=fff`,
  }));
}

const TeamContent = () => {
  const supabase = createClientComponentClient();

  const { data: team, isLoading, error } = useQuery({
    queryKey: ['enterprise-team'],
    queryFn: () => fetchTeamMembers(supabase),
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading team: {error.message}</p>
      </div>
    );
  }

  const handleMemberClick = (member: TeamMember) => {
    // Handle click, e.g., open profile modal or navigate
    console.log('Clicked on team member:', member.name);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team members and their performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Member
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Export
          </button>
        </div>
      </div>

      <Suspense fallback={<TeamLoading />}>
        {isLoading ? (
          <TeamLoading />
        ) : (
          <Team team={team || []} onMemberClick={handleMemberClick} />
        )}
      </Suspense>
    </div>
  );
};

const TeamLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
    ))}
  </div>
);

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading team...</div>}>
      <TeamContent />
    </Suspense>
  );
}
