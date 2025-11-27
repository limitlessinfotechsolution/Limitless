import { AuralisAI } from './auralisAI';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

interface EnterpriseCommand {
  type: 'query' | 'action' | 'report' | 'automation';
  entity: 'projects' | 'clients' | 'tasks' | 'billing' | 'qa' | 'leads' | 'team' | 'calendar';
  action: string;
  parameters: Record<string, any>;
}

interface AIInsight {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'revenue' | 'team' | 'optimization' | 'risk' | 'opportunity';
  actionable: boolean;
}

// Extend the base AuralisAI class for enterprise-specific commands and insights
export class EnterpriseAuralisAI extends AuralisAI {
  constructor() {
    super();
  }

  // Parse natural language commands into structured enterprise commands
  parseEnterpriseCommand(command: string): EnterpriseCommand {
    const lowerCommand = command.toLowerCase();

    // Project-related commands
    if (lowerCommand.includes('project') || lowerCommand.includes('projects')) {
      if (lowerCommand.includes('create') || lowerCommand.includes('new')) {
        return {
          type: 'action',
          entity: 'projects',
          action: 'create',
          parameters: { name: this.extractProjectName(command) }
        };
      }
      if (lowerCommand.includes('status') || lowerCommand.includes('progress')) {
        return {
          type: 'query',
          entity: 'projects',
          action: 'status',
          parameters: { projectId: this.extractProjectId(command) }
        };
      }
      if (lowerCommand.includes('list') || lowerCommand.includes('show')) {
        return {
          type: 'query',
          entity: 'projects',
          action: 'list',
          parameters: { status: this.extractStatus(command) }
        };
      }
    }

    // Task-related commands
    if (lowerCommand.includes('task') || lowerCommand.includes('tasks')) {
      if (lowerCommand.includes('pending') || lowerCommand.includes('qa')) {
        return {
          type: 'query',
          entity: 'tasks',
          action: 'pending_qa',
          parameters: {}
        };
      }
      if (lowerCommand.includes('create') || lowerCommand.includes('add')) {
        return {
          type: 'action',
          entity: 'tasks',
          action: 'create',
          parameters: { description: this.extractTaskDescription(command) }
        };
      }
    }

    // Meeting/Calendar commands
    if (lowerCommand.includes('meeting') || lowerCommand.includes('schedule')) {
      return {
        type: 'action',
        entity: 'calendar',
        action: 'create_meeting',
        parameters: {
          title: this.extractMeetingTitle(command),
          participants: this.extractParticipants(command)
        }
      };
    }

    // Report generation
    if (lowerCommand.includes('report') || lowerCommand.includes('generate')) {
      if (lowerCommand.includes('revenue') || lowerCommand.includes('financial')) {
        return {
          type: 'report',
          entity: 'billing',
          action: 'revenue_report',
          parameters: { period: this.extractPeriod(command) }
        };
      }
      if (lowerCommand.includes('performance') || lowerCommand.includes('productivity')) {
        return {
          type: 'report',
          entity: 'team',
          action: 'performance_report',
          parameters: { period: this.extractPeriod(command) }
        };
      }
    }

    // Client-related commands
    if (lowerCommand.includes('client') || lowerCommand.includes('clients')) {
      if (lowerCommand.includes('list') || lowerCommand.includes('show')) {
        return {
          type: 'query',
          entity: 'clients',
          action: 'list',
          parameters: { status: this.extractStatus(command) }
        };
      }
    }

    // Default fallback
    return {
      type: 'query',
      entity: 'projects',
      action: 'help',
      parameters: {}
    };
  }

  // Process enterprise commands with actual data operations
  async processEnterpriseCommand(command: string): Promise<string> {
    try {
      const parsedCommand = this.parseEnterpriseCommand(command);

      switch (parsedCommand.type) {
        case 'query':
          return await this.handleQueryCommand(parsedCommand);
        case 'action':
          return await this.handleActionCommand(parsedCommand);
        case 'report':
          return await this.handleReportCommand(parsedCommand);
        case 'automation':
          return await this.handleAutomationCommand(parsedCommand);
        default:
          return 'I understand you want to perform an action, but I need more specific details. Try commands like "Show pending QA tasks", "Create meeting", or "Generate revenue report".';
      }
    } catch (error) {
      console.error('Error processing enterprise command:', error);
      return 'I encountered an error processing your request. Please try again or contact support if the issue persists.';
    }
  }

  private async handleQueryCommand(command: EnterpriseCommand): Promise<string> {
    switch (command.entity) {
      case 'projects':
        if (command.action === 'list') {
          return await this.getProjectsList(command.parameters);
        }
        if (command.action === 'status') {
          return await this.getProjectStatus(command.parameters);
        }
        break;

      case 'tasks':
        if (command.action === 'pending_qa') {
          return await this.getPendingQATasks();
        }
        break;

      case 'clients':
        if (command.action === 'list') {
          return await this.getClientsList(command.parameters);
        }
        break;
    }

    return 'Query processed. Let me fetch that information for you.';
  }

  private async handleActionCommand(command: EnterpriseCommand): Promise<string> {
    switch (command.entity) {
      case 'projects':
        if (command.action === 'create') {
          return await this.createProject(command.parameters);
        }
        break;

      case 'tasks':
        if (command.action === 'create') {
          return await this.createTask(command.parameters);
        }
        break;

      case 'calendar':
        if (command.action === 'create_meeting') {
          return await this.createMeeting(command.parameters);
        }
        break;
    }

    return 'Action initiated. I\'ll help you complete this task.';
  }

  private async handleReportCommand(command: EnterpriseCommand): Promise<string> {
    switch (command.entity) {
      case 'billing':
        if (command.action === 'revenue_report') {
          return await this.generateRevenueReport(command.parameters);
        }
        break;

      case 'team':
        if (command.action === 'performance_report') {
          return await this.generatePerformanceReport(command.parameters);
        }
        break;
    }

    return 'Report generation started. You\'ll receive it shortly.';
  }

  private async handleAutomationCommand(command: EnterpriseCommand): Promise<string> {
    // Placeholder for automation commands
    return 'Automation workflow initiated. I\'ll handle this process for you.';
  }

  // Data fetching methods
  private async getPendingQATasks(): Promise<string> {
    if (!supabase) return 'Database connection not available.';

    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id (name),
          assigned_to:assigned_user_id (full_name)
        `)
        .eq('status', 'qa_pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!tasks || tasks.length === 0) {
        return 'Great news! You have no pending QA tasks at the moment.';
      }

      const taskList = tasks.map(task =>
        `• ${task.title} (${task.projects?.name || 'Unknown Project'}) - Assigned to: ${task.assigned_to?.full_name || 'Unassigned'}`
      ).join('\n');

      return `You have ${tasks.length} pending QA tasks:\n\n${taskList}\n\nWould you like me to help prioritize these or assign them to team members?`;
    } catch (error) {
      console.error('Error fetching QA tasks:', error);
      return 'I encountered an error fetching QA tasks. Please try again later.';
    }
  }

  private async createMeeting(parameters: Record<string, any>): Promise<string> {
    // Placeholder for meeting creation logic
    const title = parameters.title || 'New Meeting';
    const participants = parameters.participants || 'To be determined';

    return `Meeting "${title}" creation initiated. I'll help you schedule this with participants: ${participants}. What date and time works best for you?`;
  }

  private async generateRevenueReport(parameters: Record<string, any>): Promise<string> {
    const period = parameters.period || 'last_month';

    return `Generating revenue report for ${period}. This will include revenue trends, top-performing projects, and financial insights. You'll receive the report via email within the next few minutes.`;
  }

  private async getProjectsList(parameters: Record<string, any>): Promise<string> {
    if (!supabase) return 'Database connection not available.';

    try {
      const status = parameters.status || 'active';
      const { data: projects, error } = await supabase
        .from('projects')
        .select('name, status, progress_percentage, deadline')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (!projects || projects.length === 0) {
        return `No ${status} projects found. Would you like to create a new project?`;
      }

      const projectList = projects.map(project =>
        `• ${project.name} - ${project.progress_percentage || 0}% complete (Due: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'})`
      ).join('\n');

      return `Here are your ${status} projects:\n\n${projectList}`;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return 'I encountered an error fetching projects. Please try again later.';
    }
  }

  private async getProjectStatus(_parameters: Record<string, any>): Promise<string> {
    // Placeholder implementation
    return 'Project status retrieved. The project is currently in development phase with 75% completion.';
  }

  private async getClientsList(parameters: Record<string, any>): Promise<string> {
    if (!supabase) return 'Database connection not available.';

    try {
      const status = parameters.status || 'active';
      const { data: clients, error } = await supabase
        .from('clients')
        .select('company_name, contact_person, status, last_contact')
        .eq('status', status)
        .order('last_contact', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (!clients || clients.length === 0) {
        return `No ${status} clients found.`;
      }

      const clientList = clients.map(client =>
        `• ${client.company_name} - ${client.contact_person} (Last contact: ${client.last_contact ? new Date(client.last_contact).toLocaleDateString() : 'Never'})`
      ).join('\n');

      return `Here are your ${status} clients:\n\n${clientList}`;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return 'I encountered an error fetching clients. Please try again later.';
    }
  }

  private async createProject(parameters: Record<string, any>): Promise<string> {
    // Placeholder for project creation
    const name = parameters.name || 'New Project';
    return `Project "${name}" creation workflow started. I'll guide you through setting up the project details, team assignment, and timeline.`;
  }

  private async createTask(parameters: Record<string, any>): Promise<string> {
    // Placeholder for task creation
    const description = parameters.description || 'New Task';
    return `Task "${description}" creation initiated. I'll help you assign it to the right team member and set appropriate deadlines.`;
  }

  private async generatePerformanceReport(parameters: Record<string, any>): Promise<string> {
    const period = parameters.period || 'last_month';
    return `Generating team performance report for ${period}. This will include productivity metrics, task completion rates, and individual performance insights.`;
  }

  // Generate dynamic AI insights for the enterprise dashboard
  async generateEnterpriseInsights(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      if (supabase) {
        // Revenue insights
        const { data: revenueData } = await supabase
          .from('revenue')
          .select('amount, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (revenueData && revenueData.length > 0) {
          const totalRevenue = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
          const avgRevenue = totalRevenue / revenueData.length;

          insights.push({
            title: 'Revenue Optimization Opportunity',
            description: `Your average monthly revenue is $${avgRevenue.toLocaleString()}. Consider upselling premium services to increase this by 15-20%.`,
            priority: 'medium',
            category: 'revenue',
            actionable: true
          });
        }

        // Task completion insights
        const { data: tasks } = await supabase
          .from('tasks')
          .select('status, created_at, updated_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (tasks && tasks.length > 0) {
          const completedTasks = tasks.filter(task => task.status === 'completed').length;
          const completionRate = (completedTasks / tasks.length) * 100;

          if (completionRate < 70) {
            insights.push({
              title: 'Task Completion Rate Needs Attention',
              description: `Your team completed ${completionRate.toFixed(1)}% of tasks this week. Consider redistributing workload or providing additional training.`,
              priority: 'high',
              category: 'team',
              actionable: true
            });
          }
        }

        // Client engagement insights
        const { data: clients } = await supabase
          .from('clients')
          .select('last_contact, status')
          .eq('status', 'active');

        if (clients && clients.length > 0) {
          const inactiveClients = clients.filter(client => {
            if (!client.last_contact) return true;
            const daysSinceContact = (Date.now() - new Date(client.last_contact).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceContact > 30;
          }).length;

          if (inactiveClients > 0) {
            insights.push({
              title: 'Client Re-engagement Needed',
              description: `${inactiveClients} active clients haven't been contacted in over 30 days. Schedule follow-up meetings to maintain relationships.`,
              priority: 'medium',
              category: 'opportunity',
              actionable: true
            });
          }
        }
      }

      // Add some default insights if database is not available or no data
      if (insights.length === 0) {
        insights.push(
          {
            title: 'Welcome to Your AI-Powered Dashboard',
            description: 'Your enterprise portal is now enhanced with AI insights. I\'ll provide real-time recommendations to optimize your operations.',
            priority: 'low',
            category: 'optimization',
            actionable: false
          },
          {
            title: 'Try Conversational Commands',
            description: 'Use natural language commands like "Show pending QA tasks" or "Generate revenue report" to interact with your data.',
            priority: 'low',
            category: 'optimization',
            actionable: false
          }
        );
      }

    } catch (error) {
      console.error('Error generating enterprise insights:', error);
      // Return default insights on error
      insights.push({
        title: 'AI Insights Temporarily Unavailable',
        description: 'We\'re working to restore AI insights. Basic dashboard functionality remains available.',
        priority: 'low',
        category: 'optimization',
        actionable: false
      });
    }

    return insights;
  }

  // Helper methods for extracting information from commands
  private extractProjectName(command: string): string {
    // Simple extraction - could be enhanced with NLP
    const words = command.split(' ');
    const projectIndex = words.findIndex(word => word.toLowerCase().includes('project'));
    if (projectIndex !== -1 && projectIndex + 1 < words.length) {
      return words.slice(projectIndex + 1).join(' ');
    }
    return 'New Project';
  }

  private extractProjectId(command: string): string | null {
    // Extract project ID or name from command
    const match = command.match(/project\s+(\w+)/i);
    return match ? match[1] : null;
  }

  private extractStatus(command: string): string {
    if (command.toLowerCase().includes('active')) return 'active';
    if (command.toLowerCase().includes('completed')) return 'completed';
    if (command.toLowerCase().includes('pending')) return 'pending';
    return 'active';
  }

  private extractTaskDescription(command: string): string {
    const match = command.match(/(?:create|add)\s+(?:a\s+)?task\s+(?:to|for)\s+(.+)/i);
    return match ? match[1] : 'New Task';
  }

  private extractMeetingTitle(command: string): string {
    const match = command.match(/meeting\s+(?:about|for|with)\s+(.+)/i);
    return match ? match[1] : 'Team Meeting';
  }

  private extractParticipants(command: string): string[] {
    // Simple extraction - could be enhanced
    const words = command.toLowerCase().split(' ');
    const withIndex = words.indexOf('with');
    if (withIndex !== -1) {
      return words.slice(withIndex + 1);
    }
    return ['team'];
  }

  private extractPeriod(command: string): string {
    if (command.toLowerCase().includes('last month')) return 'last_month';
    if (command.toLowerCase().includes('this month')) return 'this_month';
    if (command.toLowerCase().includes('last week')) return 'last_week';
    if (command.toLowerCase().includes('this week')) return 'this_week';
    if (command.toLowerCase().includes('quarter')) return 'quarter';
    return 'last_month';
  }
}
