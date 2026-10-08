const prisma = require('../config/prisma');
const { successResponse } = require('../utils/response');

// Admin: GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalInquiries,
      newInquiries,
      completedInquiries,
      inProgressInquiries,
      totalProjects,
      totalServices,
      totalTestimonials,
      approvedTestimonials,
      totalContactMessages,
      unreadContactMessages,
      recentInquiries,
    ] = await Promise.all([
      prisma.customerInquiry.count(),
      prisma.customerInquiry.count({ where: { status: 'NEW' } }),
      prisma.customerInquiry.count({ where: { status: 'COMPLETED' } }),
      prisma.customerInquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.project.count(),
      prisma.service.count(),
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { approved: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.customerInquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),
    ]);

    const stats = {
      inquiries: {
        total: totalInquiries,
        new: newInquiries,
        inProgress: inProgressInquiries,
        completed: completedInquiries,
      },
      projects: {
        total: totalProjects,
      },
      services: {
        total: totalServices,
      },
      testimonials: {
        total: totalTestimonials,
        approved: approvedTestimonials,
      },
      contactMessages: {
        total: totalContactMessages,
        unread: unreadContactMessages,
      },
      recentInquiries,
    };

    return successResponse(res, stats, 'Dashboard metrics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
