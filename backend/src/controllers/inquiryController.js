const prisma = require('../config/prisma');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');
const { successResponse, errorResponse } = require('../utils/response');

// Public: POST /api/inquiries
const createInquiry = async (req, res, next) => {
  try {
    const { fullName, phone, email, location, serviceId, budgetRange, description } = req.body;

    // Verify service exists if serviceId is provided
    if (serviceId) {
      const serviceExists = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (!serviceExists) {
        return errorResponse(res, 'Selected service does not exist', 400);
      }
    }

    const inquiry = await prisma.customerInquiry.create({
      data: {
        fullName,
        phone,
        email,
        location,
        serviceId: serviceId || null,
        budgetRange: budgetRange || null,
        description,
        status: 'NEW',
      },
      include: {
        service: true,
      },
    });

    // Fire-and-forget notification service triggers
    emailService.sendInquiryNotification(inquiry).catch(console.error);
    whatsappService.notifyNewInquiry(inquiry).catch(console.error);

    return successResponse(
      res,
      {
        id: inquiry.id,
        fullName: inquiry.fullName,
        createdAt: inquiry.createdAt,
      },
      'Thank you! Your project inquiry has been received. Our team will contact you shortly.',
      201
    );
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/inquiries
const adminGetInquiries = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const where = status ? { status } : {};

    const [total, inquiries] = await Promise.all([
      prisma.customerInquiry.count({ where }),
      prisma.customerInquiry.findMany({
        where,
        include: { service: true },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
    ]);

    return successResponse(
      res,
      {
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / take),
        inquiries,
      },
      'Inquiries retrieved'
    );
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/inquiries/:id
const adminGetInquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await prisma.customerInquiry.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!inquiry) {
      return errorResponse(res, 'Inquiry not found', 404);
    }
    return successResponse(res, inquiry, 'Inquiry details retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/inquiries/:id
const adminUpdateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await prisma.customerInquiry.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    const updated = await prisma.customerInquiry.update({
      where: { id },
      data: { status },
      include: { service: true },
    });

    return successResponse(res, updated, 'Inquiry status updated successfully');
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/inquiries/:id
const adminDeleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.customerInquiry.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    await prisma.customerInquiry.delete({ where: { id } });
    return successResponse(res, null, 'Inquiry deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  adminGetInquiries,
  adminGetInquiryById,
  adminUpdateInquiry,
  adminDeleteInquiry,
};
