const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

// Public: GET /api/social-links
const getSocialLinks = async (req, res, next) => {
  try {
    const links = await prisma.socialLink.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    });
    return successResponse(res, links, 'Active social links retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/social-links
const adminGetSocialLinks = async (req, res, next) => {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return successResponse(res, links, 'All social links retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: POST /api/admin/social-links
const adminCreateSocialLink = async (req, res, next) => {
  try {
    const link = await prisma.socialLink.create({ data: req.body });
    return successResponse(res, link, 'Social link created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/social-links/:id
const adminUpdateSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Social link not found', 404);
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: req.body,
    });
    return successResponse(res, updated, 'Social link updated successfully');
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/social-links/:id
const adminDeleteSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Social link not found', 404);
    }

    await prisma.socialLink.delete({ where: { id } });
    return successResponse(res, null, 'Social link deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSocialLinks,
  adminGetSocialLinks,
  adminCreateSocialLink,
  adminUpdateSocialLink,
  adminDeleteSocialLink,
};
