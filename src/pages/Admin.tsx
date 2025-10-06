'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import LoginGate from '../components/admin/LoginGate';
import ProfessionalLoader from '../components/ui/ProfessionalLoader';

const Admin: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin' || profile?.role === 'super_admin') {
          router.push('/admin/dashboard');
        }
      }
    };

    checkAndRedirect();
  }, [router]);

  return (
    <LoginGate>
      <div className="max-h-screen flex items-center justify-center">
        <ProfessionalLoader />
      </div>
    </LoginGate>
  );
};



export default Admin;
