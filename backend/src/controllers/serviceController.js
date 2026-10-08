const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

// Public: GET /api/services
const getServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { displayOrder: 'asc' },
    });
    return successResponse(res, services, 'Services retrieved');
  } catch (error) {
    next(error);
  }
};

// Public: GET /api/services/:slug
const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (!service) {
      return errorResponse(res, 'Service not found', 404);
    }
    return successResponse(res, service, 'Service retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/services
const adminGetServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return successResponse(res, services, 'All services retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: POST /api/admin/services
const adminCreateService = async (req, res, next) => {
  try {
    const data = req.body;
    const existing = await prisma.service.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return errorResponse(res, 'A service with this slug already exists', 400);
    }

    const service = await prisma.service.create({ data });
    return successResponse(res, service, 'Service created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/services/:id
const adminUpdateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Service not found', 404);
    }

    const updated = await prisma.service.update({
      where: { id },
      data,
    });
    return successResponse(res, updated, 'Service updated successfully');
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/services/:id
const adminDeleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Service not found', 404);
    }

    await prisma.service.delete({ where: { id } });
    return successResponse(res, null, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
};
