import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface NotificationData {
  type: 'lead' | 'support' | 'feedback' | 'error';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  // Send email notification to admin
  async sendAdminNotification(notification: NotificationData) {
    try {
      // Get admin email from environment or database
      const adminEmail = process.env.ADMIN_EMAIL || 'info@limitlessinfotech.com';
      
      // Prepare email content
      const emailContent = this.generateEmailContent(notification);
      
      // Send email via API
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminEmail,
          from: 'notifications@limitlessinfotech.com',
          subject: `[Limitless] ${notification.title}`,
          html: emailContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send email notification: ${response.statusText}`);
      }
      
      // Log notification in database
      await this.logNotification(notification);
      
      console.log('Admin notification sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  // Send notification to founder
  async sendFounderNotification(notification: NotificationData) {
    try {
      // Get founder email from environment or database
      const founderEmail = process.env.FOUNDER_EMAIL || process.env.ADMIN_EMAIL || 'info@limitlessinfotech.com';
      
      // Prepare email content
      const emailContent = this.generateEmailContent(notification);
      
      // Send email via API
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: founderEmail,
          from: 'notifications@limitlessinfotech.com',
          subject: `[Limitless] ${notification.title}`,
          html: emailContent,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send email notification: ${response.statusText}`);
      }
      
      // Log notification in database
      await this.logNotification(notification);
      
      console.log('Founder notification sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending founder notification:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  // Send notification to both admin and founder
  async sendNotificationToBoth(notification: NotificationData) {
    const adminResult = await this.sendAdminNotification(notification);
    const founderResult = await this.sendFounderNotification(notification);
    
    return {
      admin: adminResult,
      founder: founderResult
    };
  }
  
  // Generate HTML email content
  private generateEmailContent(notification: NotificationData): string {
    const priorityColors = {
      low: '#4ade80',
      medium: '#fbbf24',
      high: '#f87171'
    };
    
    const priorityLabels = {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority'
    };
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Limitless Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Limitless Infotech</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Notification System</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px; padding: 10px; background: ${priorityColors[notification.priority]}; color: white; border-radius: 5px;">
              <span style="font-weight: bold; font-size: 16px;">${priorityLabels[notification.priority]}</span>
            </div>
            
            <h2 style="color: #333; margin-bottom: 15px;">${notification.title}</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 0;">${notification.message}</p>
            </div>
            
            ${notification.metadata ? `
              <div style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px; color: #555;">Additional Details:</h3>
                <div style="background: #f1f5f9; padding: 15px; border-radius: 5px;">
                  ${Object.entries(notification.metadata).map(([key, value]) => `
                    <div style="margin-bottom: 8px;">
                      <strong>${this.formatKey(key)}:</strong> 
                      <span>${this.formatValue(value)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.SITE_URL || 'https://limitlessinfotech.com'}" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Visit Dashboard
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e5e9; color: #666; font-size: 12px;">
              <p>This is an automated notification from Limitless Infotech.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  
  // Format object keys for display
  private formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
  
  // Format values for display
  private formatValue(value: unknown): string {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
  
  // Log notification in database
  private async logNotification(notification: NotificationData) {
    try {
      await supabase.from('notifications').insert({
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        metadata: notification.metadata || {},
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }
  
  // Create lead notification
  createLeadNotification(leadData: Record<string, unknown>) {
    return {
      type: 'lead' as const,
      title: 'New Lead Generated',
      message: `A new lead has been generated through the Auralis chatbot.`,
      priority: 'high' as const,
      metadata: {
        lead_id: leadData.id,
        source: leadData.source,
        conversation_summary: leadData.conversation_summary,
        created_at: leadData.created_at
      }
    };
  }
  
  // Create support notification
  createSupportNotification(supportData: Record<string, unknown>) {
    return {
      type: 'support' as const,
      title: 'Support Request Received',
      message: `A new support request has been submitted through the Auralis chatbot.`,
      priority: 'medium' as const,
      metadata: {
        session_id: supportData.session_id,
        issue_description: supportData.issue_description,
        user_details: supportData.user_details,
        submitted_at: new Date().toISOString()
      }
    };
  }
  
  // Create feedback notification
  createFeedbackNotification(feedbackData: Record<string, unknown>) {
    return {
      type: 'feedback' as const,
      title: 'User Feedback Received',
      message: `User feedback has been received for the Auralis chatbot.`,
      priority: feedbackData.feedback === 'negative' ? 'medium' : 'low',
      metadata: {
        message_id: feedbackData.message_id,
        feedback: feedbackData.feedback,
        session_id: feedbackData.session_id,
        submitted_at: new Date().toISOString()
      }
    };
  }
  
  // Create error notification
  createErrorNotification(errorData: Record<string, unknown>) {
    return {
      type: 'error' as const,
      title: 'System Error Detected',
      message: `An error has occurred in the Auralis chatbot system.`,
      priority: 'high' as const,
      metadata: {
        error_message: errorData.error_message,
        error_stack: errorData.error_stack,
        context: errorData.context,
        occurred_at: new Date().toISOString()
      }
    };
  }
}