const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

// Public: GET /api/testimonials (Only approved)
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(res, testimonials, 'Approved testimonials retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/testimonials (All)
const adminGetTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(res, testimonials, 'All testimonials retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: POST /api/admin/testimonials
const adminCreateTestimonial = async (req, res, next) => {
  try {
    const data = req.body;
    const testimonial = await prisma.testimonial.create({ data });
    return successResponse(res, testimonial, 'Testimonial created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/testimonials/:id
const adminUpdateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    });
    return successResponse(res, updated, 'Testimonial updated successfully');
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/testimonials/:id
const adminDeleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    await prisma.testimonial.delete({ where: { id } });
    return successResponse(res, null, 'Testimonial deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  adminGetTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
};
