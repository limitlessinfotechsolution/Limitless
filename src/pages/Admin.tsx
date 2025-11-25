import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'src/lib/supabaseClient';
import LoginGate from 'src/components/admin/utils/LoginGate';
import ProfessionalLoader from 'src/components/ui/ProfessionalLoader';
import { AdminLayout } from 'src/components/admin/layout/AdminLayout';
import Dashboard from 'src/components/admin/dashboard/AdvancedDashboard';

export type AdminView = 'dashboard' | 'pages' | 'portfolio' | 'testimonials' | 'leads' | 'users' | 'faq';

const Admin: React.FC = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

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
          setReady(true);
        } else {
          router.push('/'); // non-admin fallback
        }
      }
    };
    checkAndRedirect();
  }, [router]);

  if (!ready) {
    return (
      <LoginGate>
        <div className="max-h-screen flex items-center justify-center">
          <ProfessionalLoader />
        </div>
      </LoginGate>
    );
  }

  // Render the layout with the appropriate view component
  return (
    <AdminLayout activeView={activeView} setActiveView={setActiveView}>
      {/* Switch view based on activeView – for now we only have Dashboard */}
      {activeView === 'dashboard' && <Dashboard />}
      {/* Future: add <Pages />, <Portfolio />, etc. */}
    </AdminLayout>
  );
};

export default Admin;
