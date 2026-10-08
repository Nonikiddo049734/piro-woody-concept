/**
 * WhatsApp Integration Service Architecture
 * Ready for WhatsApp Business API / Twilio / Meta Cloud API integration.
 */
class WhatsAppService {
  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || null;
    this.businessPhone = process.env.WHATSAPP_PHONE || '2348137808170';
    this.isConfigured = Boolean(this.apiKey);
  }

  /**
   * Generates a pre-filled direct WhatsApp click-to-chat URL.
   */
  generateChatUrl(message = 'Hello Piro Woody Concepts, I would like to make an enquiry.') {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${this.businessPhone}?text=${encoded}`;
  }

  /**
   * Prepared for future automated backend-to-WhatsApp dispatch when API keys are configured.
   */
  async notifyNewInquiry(inquiry) {
    if (!this.isConfigured) {
      console.log(
        '[WhatsAppService: Staged] Direct WhatsApp automation pending provider credentials.',
        {
          target: this.businessPhone,
          inquiryId: inquiry.id,
          customer: inquiry.fullName,
        }
      );
      return { active: false, reason: 'WHATSAPP_API_KEY not configured' };
    }

    // Live dispatch logic when provider credentials are added
    console.log(`[WhatsAppService] Dispatching WhatsApp notification for ${inquiry.id}`);
    return { active: true };
  }
}

module.exports = new WhatsAppService();
