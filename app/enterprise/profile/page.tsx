'use client';
import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';
import EnterpriseUserProfile from '@/components/enterprise/EnterpriseUserProfile';
import Skeleton from '@/components/ui/Skeleton';
import { Edit } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  jobTitle: string;
  department: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  bio?: string;
  skills: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

import { TypedSupabaseClient } from '@/types';

async function fetchUserProfile(supabase: TypedSupabaseClient, userId: string): Promise<UserProfile> {
  // Fetch user profile from Supabase (assume 'profiles' table linked to auth.users)
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      users (email, created_at)
    `)
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows

  if (!data) {
    // Fallback to basic profile from auth.user
    const { data: { user } } = await supabase.auth.getUser();
    return {
      id: userId,
      name: user?.email?.split('@')[0] || 'User',
      email: user?.email || '',
      phone: '',
      location: '',
      jobTitle: 'Software Engineer',
      department: 'Engineering',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=0D8ABC&color=fff`,
      joinDate: new Date(user?.created_at || Date.now()).toLocaleDateString(),
      lastActive: new Date().toLocaleDateString(),
      bio: 'No bio provided.',
      skills: ['JavaScript', 'React'],
      socialLinks: {},
    };
  }

  // Map data to UserProfile
  return {
    id: data.id,
    name: data.name || data.users.email.split('@')[0],
    email: data.users.email,
    phone: data.phone,
    location: data.location,
    jobTitle: data.job_title || 'Software Engineer',
    department: data.department || 'Engineering',
    avatar: data.avatar_url ? supabase.storage.from('avatars').getPublicUrl(data.avatar_url).data.publicUrl : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0D8ABC&color=fff`,
    joinDate: new Date(data.created_at).toLocaleDateString(),
    lastActive: new Date(data.updated_at || Date.now()).toLocaleDateString(),
    bio: data.bio || 'No bio provided.',
    skills: data.skills ? data.skills.split(',') : ['JavaScript', 'React'],
    socialLinks: {
      linkedin: data.linkedin,
      twitter: data.twitter,
      github: data.github,
    },
  };
}

const ProfileContent = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const supabase = createClientComponentClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => fetchUserProfile(supabase, user?.id || ''),
    enabled: !!user,
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </div>
    );
  }

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    if (!user) return;

    // Update profile in Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        location: updatedProfile.location,
        job_title: updatedProfile.jobTitle,
        department: updatedProfile.department,
        bio: updatedProfile.bio,
        skills: updatedProfile.skills.join(','),
        linkedin: updatedProfile.socialLinks?.linkedin,
        twitter: updatedProfile.socialLinks?.twitter,
        github: updatedProfile.socialLinks?.github,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      alert('Error updating profile');
    } else {
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      alert('Profile updated successfully!');
    }
  };

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4 mr-2 inline" />
            Edit Profile
          </button>
        </div>
      </div>

      <Suspense fallback={<ProfileLoading />}>
        <EnterpriseUserProfile
          user={profile || {} as UserProfile}
          editable={true}
          onSave={handleSaveProfile}
        />
      </Suspense>
    </div>
  );
};

const ProfileLoading = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <div className="flex items-center space-x-6">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-4 flex-1">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const user = useUser();

  if (!user) {
    return <div className="text-center py-8">Please log in to view your profile.</div>;
  }

  return (
    <Suspense fallback={<div className="text-center py-8">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
