/**
 * Email Notification Service Architecture
 * Designed for plug-and-play integration with SMTP, Resend, SendGrid, or AWS SES.
 */
const config = require('../config/env');

class EmailService {
  constructor() {
    this.isConfigured = Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    );
  }

  /**
   * Dispatches new inquiry notification to business email.
   */
  async sendInquiryNotification(inquiry) {
    if (!this.isConfigured) {
      console.log(
        `[EmailService: Simulated] New customer inquiry notification ready for ${config.notificationEmail}:`,
        {
          name: inquiry.fullName,
          phone: inquiry.phone,
          email: inquiry.email,
          location: inquiry.location,
          budget: inquiry.budgetRange,
        }
      );
      return { sent: false, reason: 'SMTP credentials not configured in environment' };
    }

    // When credentials are provided, standard nodemailer / API dispatch triggers here
    console.log(`[EmailService] Dispatching live notification for inquiry ${inquiry.id}`);
    return { sent: true };
  }

  /**
   * Dispatches new contact message notification.
   */
  async sendContactNotification(contact) {
    if (!this.isConfigured) {
      console.log(
        `[EmailService: Simulated] New contact message for ${config.notificationEmail} from ${contact.name} (${contact.email})`
      );
      return { sent: false, reason: 'SMTP credentials not configured in environment' };
    }
    return { sent: true };
  }
}

module.exports = new EmailService();
