const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const serviceController = require('../controllers/serviceController');
const projectController = require('../controllers/projectController');
const inquiryController = require('../controllers/inquiryController');
const contactController = require('../controllers/contactController');
const testimonialController = require('../controllers/testimonialController');
const businessController = require('../controllers/businessController');
const socialController = require('../controllers/socialController');
const dashboardController = require('../controllers/dashboardController');

const { authenticateAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  loginSchema,
  changePasswordSchema,
  updateInquiryStatusSchema,
  createServiceSchema,
  updateServiceSchema,
  createProjectSchema,
  updateProjectSchema,
  createTestimonialSchema,
  updateBusinessSchema,
  createSocialLinkSchema,
} = require('../utils/validators');

// Auth routes
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/logout', authenticateAdmin, authController.logout);
router.get('/auth/me', authenticateAdmin, authController.getProfile);
router.post(
  '/auth/change-password',
  authenticateAdmin,
  validate(changePasswordSchema),
  authController.changePassword
);

// Dashboard metrics
router.get('/dashboard', authenticateAdmin, dashboardController.getDashboardStats);

// Services management
router.get('/services', authenticateAdmin, serviceController.adminGetServices);
router.post(
  '/services',
  authenticateAdmin,
  validate(createServiceSchema),
  serviceController.adminCreateService
);
router.patch(
  '/services/:id',
  authenticateAdmin,
  validate(updateServiceSchema),
  serviceController.adminUpdateService
);
router.delete('/services/:id', authenticateAdmin, serviceController.adminDeleteService);

// Projects & Images management
router.get('/projects', authenticateAdmin, projectController.adminGetProjects);
router.post(
  '/projects',
  authenticateAdmin,
  validate(createProjectSchema),
  projectController.adminCreateProject
);
router.patch(
  '/projects/:id',
  authenticateAdmin,
  validate(updateProjectSchema),
  projectController.adminUpdateProject
);
router.delete('/projects/:id', authenticateAdmin, projectController.adminDeleteProject);
router.post(
  '/projects/:id/images',
  authenticateAdmin,
  projectController.adminAddProjectImage
);
router.delete(
  '/projects/images/:imageId',
  authenticateAdmin,
  projectController.adminDeleteProjectImage
);

// Customer inquiries management
router.get('/inquiries', authenticateAdmin, inquiryController.adminGetInquiries);
router.get('/inquiries/:id', authenticateAdmin, inquiryController.adminGetInquiryById);
router.patch(
  '/inquiries/:id',
  authenticateAdmin,
  validate(updateInquiryStatusSchema),
  inquiryController.adminUpdateInquiry
);
router.delete('/inquiries/:id', authenticateAdmin, inquiryController.adminDeleteInquiry);

// Contact messages management
router.get('/contact', authenticateAdmin, contactController.adminGetContacts);
router.get('/contact/:id', authenticateAdmin, contactController.adminGetContactById);
router.patch('/contact/:id', authenticateAdmin, contactController.adminUpdateContactStatus);
router.delete('/contact/:id', authenticateAdmin, contactController.adminDeleteContact);

// Testimonials management
router.get('/testimonials', authenticateAdmin, testimonialController.adminGetTestimonials);
router.post(
  '/testimonials',
  authenticateAdmin,
  validate(createTestimonialSchema),
  testimonialController.adminCreateTestimonial
);
router.patch(
  '/testimonials/:id',
  authenticateAdmin,
  testimonialController.adminUpdateTestimonial
);
router.delete(
  '/testimonials/:id',
  authenticateAdmin,
  testimonialController.adminDeleteTestimonial
);

// Business information management
router.get('/business', authenticateAdmin, businessController.getBusinessInfo);
router.patch(
  '/business',
  authenticateAdmin,
  validate(updateBusinessSchema),
  businessController.adminUpdateBusinessInfo
);

// Social links management
router.get('/social-links', authenticateAdmin, socialController.adminGetSocialLinks);
router.post(
  '/social-links',
  authenticateAdmin,
  validate(createSocialLinkSchema),
  socialController.adminCreateSocialLink
);
router.patch('/social-links/:id', authenticateAdmin, socialController.adminUpdateSocialLink);
router.delete('/social-links/:id', authenticateAdmin, socialController.adminDeleteSocialLink);

module.exports = router;
