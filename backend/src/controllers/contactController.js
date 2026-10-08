const prisma = require('../config/prisma');
const emailService = require('../services/emailService');
const { successResponse, errorResponse } = require('../utils/response');

// Public: POST /api/contact
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: 'UNREAD',
      },
    });

    emailService.sendContactNotification(contact).catch(console.error);

    return successResponse(
      res,
      { id: contact.id, createdAt: contact.createdAt },
      'Thank you! Your message has been sent successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/contact
const adminGetContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, messages, 'Contact messages retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/contact/:id
const adminGetContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await prisma.contactMessage.findUnique({ where: { id } });
    if (!contact) {
      return errorResponse(res, 'Message not found', 404);
    }

    // Auto-mark as READ if UNREAD
    if (contact.status === 'UNREAD') {
      await prisma.contactMessage.update({
        where: { id },
        data: { status: 'READ' },
      });
      contact.status = 'READ';
    }

    return successResponse(res, contact, 'Contact message retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/contact/:id
const adminUpdateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Message not found', 404);
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return successResponse(res, updated, 'Message status updated');
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/contact/:id
const adminDeleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Message not found', 404);
    }

    await prisma.contactMessage.delete({ where: { id } });
    return successResponse(res, null, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  adminGetContacts,
  adminGetContactById,
  adminUpdateContactStatus,
  adminDeleteContact,
};
