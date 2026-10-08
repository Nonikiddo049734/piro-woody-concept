const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

// Public: GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const where = { status: 'PUBLISHED' };

    if (category && category !== 'All') {
      where.category = category;
    }
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, projects, 'Projects retrieved');
  } catch (error) {
    next(error);
  }
};

// Public: GET /api/projects/:slug
const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }
    return successResponse(res, project, 'Project retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: GET /api/admin/projects
const adminGetProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(res, projects, 'All projects retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: POST /api/admin/projects
const adminCreateProject = async (req, res, next) => {
  try {
    const { images, ...projectData } = req.body;

    const existing = await prisma.project.findUnique({
      where: { slug: projectData.slug },
    });
    if (existing) {
      return errorResponse(res, 'A project with this slug already exists', 400);
    }

    const project = await prisma.project.create({
      data: {
        ...projectData,
        images: images && images.length > 0 ? { create: images } : undefined,
      },
      include: { images: true },
    });

    return successResponse(res, project, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/projects/:id
const adminUpdateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Project not found', 404);
    }

    const updated = await prisma.project.update({
      where: { id },
      data,
      include: { images: true },
    });

    return successResponse(res, updated, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/projects/:id
const adminDeleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Project not found', 404);
    }

    await prisma.project.delete({ where: { id } });
    return successResponse(res, null, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Admin: POST /api/admin/projects/:id/images
const adminAddProjectImage = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { imageUrl, altText, displayOrder } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    const image = await prisma.projectImage.create({
      data: {
        projectId,
        imageUrl,
        altText,
        displayOrder: displayOrder || 0,
      },
    });

    return successResponse(res, image, 'Image added to project', 201);
  } catch (error) {
    next(error);
  }
};

// Admin: DELETE /api/admin/projects/images/:imageId
const adminDeleteProjectImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.projectImage.findUnique({ where: { id: imageId } });
    if (!image) {
      return errorResponse(res, 'Image not found', 404);
    }

    await prisma.projectImage.delete({ where: { id: imageId } });
    return successResponse(res, null, 'Project image deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminAddProjectImage,
  adminDeleteProjectImage,
};
