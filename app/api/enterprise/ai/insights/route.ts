import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || (profile.role !== 'enterprise' && profile.role !== 'super_admin')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Generate dynamic AI insights based on current data
    const insights = await generateDynamicInsights();

    return NextResponse.json({
      insights,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Insights API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateDynamicInsights() {
  const insights = [];

  try {
    // Get project statistics
    const { data: projects } = await supabase
      .from('projects')
      .select('status, budget, actual_cost, progress_percentage');

    if (projects && projects.length > 0) {
      const totalProjects = projects.length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const avgProgress = projects.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / totalProjects;

      insights.push({
        type: 'projects',
        title: 'Project Performance',
        message: `You have ${totalProjects} active projects with an average progress of ${avgProgress.toFixed(1)}%. ${completedProjects} projects completed this month.`,
        priority: avgProgress > 80 ? 'high' : 'medium',
        icon: 'Target'
      });
    }

    // Get task statistics
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status, priority, due_date');

    if (tasks && tasks.length > 0) {
      const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;
      const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length;
      const highPriorityTasks = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length;

      if (overdueTasks > 0) {
        insights.push({
          type: 'tasks',
          title: 'Task Management Alert',
          message: `You have ${overdueTasks} overdue tasks that need immediate attention.`,
          priority: 'high',
          icon: 'AlertTriangle'
        });
      }

      insights.push({
        type: 'tasks',
        title: 'Task Overview',
        message: `${pendingTasks} tasks pending completion. ${highPriorityTasks} high-priority tasks require focus.`,
        priority: highPriorityTasks > 5 ? 'high' : 'medium',
        icon: 'CheckSquare'
      });
    }

    // Get client statistics
    const { data: clients } = await supabase
      .from('clients')
      .select('status, industry');

    if (clients && clients.length > 0) {
      const activeClients = clients.filter(c => c.status === 'active').length;
      const industries = [...new Set(clients.map(c => c.industry).filter(Boolean))];

      insights.push({
        type: 'clients',
        title: 'Client Portfolio',
        message: `${activeClients} active clients across ${industries.length} industries. Consider expanding into new sectors.`,
        priority: 'medium',
        icon: 'Users'
      });
    }

    // Get financial insights
    const { data: invoices } = await supabase
      .from('invoices')
      .select('status, total_amount, due_date');

    if (invoices && invoices.length > 0) {
      const pendingInvoices = invoices.filter(i => i.status === 'sent').length;
      const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
      const totalRevenue = invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + (i.total_amount || 0), 0);

      if (overdueInvoices > 0) {
        insights.push({
          type: 'billing',
          title: 'Payment Alert',
          message: `${overdueInvoices} invoices are overdue. Follow up with clients to maintain cash flow.`,
          priority: 'high',
          icon: 'DollarSign'
        });
      }

      insights.push({
        type: 'billing',
        title: 'Revenue Insights',
        message: `$${totalRevenue.toLocaleString()} collected this month. ${pendingInvoices} invoices awaiting payment.`,
        priority: 'medium',
        icon: 'TrendingUp'
      });
    }

    // Get QA statistics
    const { data: qaResults } = await supabase
      .from('qa_results')
      .select('overall_score, status');

    if (qaResults && qaResults.length > 0) {
      const avgQAScore = qaResults.reduce((sum, r) => sum + (r.overall_score || 0), 0) / qaResults.length;
      const pendingQA = qaResults.filter(r => r.status === 'pending').length;

      insights.push({
        type: 'qa',
        title: 'Quality Assurance',
        message: `Average QA score: ${avgQAScore.toFixed(1)}/100. ${pendingQA} QA sessions pending completion.`,
        priority: avgQAScore < 85 ? 'high' : 'medium',
        icon: 'Shield'
      });
    }

    // Get leads statistics
    const { data: leads } = await supabase
      .from('leads')
      .select('status, ai_score');

    if (leads && leads.length > 0) {
      const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
      const avgLeadScore = leads.reduce((sum, l) => sum + (l.ai_score || 0), 0) / leads.length;

      insights.push({
        type: 'leads',
        title: 'Sales Pipeline',
        message: `${qualifiedLeads} qualified leads in pipeline. Average lead score: ${avgLeadScore.toFixed(1)}/100.`,
        priority: qualifiedLeads > 10 ? 'high' : 'medium',
        icon: 'Target'
      });
    }

  } catch (error) {
    console.error('Error generating insights:', error);
  }

  // Fallback insights if no data available
  if (insights.length === 0) {
    insights.push(
      {
        type: 'general',
        title: 'Welcome to Enterprise Portal',
        message: 'Your AI-powered operations hub is ready. Start by adding projects, clients, and tasks to see dynamic insights.',
        priority: 'medium',
        icon: 'Lightbulb'
      },
      {
        type: 'optimization',
        title: 'Getting Started',
        message: 'Use the AI assistant to create meetings, generate reports, and manage your workflow efficiently.',
        priority: 'low',
        icon: 'Zap'
      }
    );
  }

  return insights.slice(0, 6); // Limit to 6 insights
}
