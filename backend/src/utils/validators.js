const { z } = require('zod');

// Auth Validators
const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username or email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

// Inquiry Validator
const createInquirySchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required (min 2 characters)'),
    phone: z.string().min(7, 'Valid phone number is required'),
    email: z.string().email('Valid email address is required'),
    location: z.string().min(2, 'Location is required'),
    serviceId: z.string().uuid('Invalid service ID').optional().nullable(),
    budgetRange: z.string().optional().nullable(),
    description: z.string().min(5, 'Project description is required (min 5 characters)'),
  }),
});

const updateInquiryStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid inquiry ID'),
  }),
  body: z.object({
    status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  }),
});

// Contact Message Validator
const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required (min 2 characters)'),
    email: z.string().email('Valid email address is required'),
    phone: z.string().optional().nullable(),
    message: z.string().min(5, 'Message is required (min 5 characters)'),
  }),
});

// Service Validators
const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Service name is required'),
    slug: z.string().min(2, 'Service slug is required'),
    description: z.string().min(5, 'Description is required'),
    image: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
    displayOrder: z.number().int().default(0),
  }),
});

const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid service ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    image: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    displayOrder: z.number().int().optional(),
  }),
});

// Project Validators
const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    slug: z.string().min(2, 'Slug is required'),
    category: z.enum([
      'Kitchen',
      'Living Room',
      'Bedroom',
      'Wardrobe',
      'Office',
      'Furniture',
      'Interior',
      'Other',
    ]),
    description: z.string().min(5, 'Description is required'),
    location: z.string().min(2, 'Location is required'),
    coverImage: z.string().min(1, 'Cover image URL is required'),
    featured: z.boolean().default(false),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
    images: z
      .array(
        z.object({
          imageUrl: z.string().min(1),
          altText: z.string().optional().nullable(),
          displayOrder: z.number().int().default(0),
        })
      )
      .optional(),
  }),
});

const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project ID'),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    category: z
      .enum([
        'Kitchen',
        'Living Room',
        'Bedroom',
        'Wardrobe',
        'Office',
        'Furniture',
        'Interior',
        'Other',
      ])
      .optional(),
    description: z.string().min(5).optional(),
    location: z.string().min(2).optional(),
    coverImage: z.string().optional(),
    featured: z.boolean().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  }),
});

// Testimonial Validators
const createTestimonialSchema = z.object({
  body: z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    customerLocation: z.string().min(2, 'Customer location is required'),
    content: z.string().min(5, 'Testimonial content is required'),
    rating: z.number().int().min(1).max(5).default(5),
    customerImage: z.string().optional().nullable(),
    approved: z.boolean().default(false),
  }),
});

// Business Information Validator
const updateBusinessSchema = z.object({
  body: z.object({
    businessName: z.string().min(1).optional(),
    phone: z.string().min(5).optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    businessHours: z.string().optional(),
    description: z.string().optional(),
    serviceAreas: z.array(z.string()).optional(),
  }),
});

// Social Link Validator
const createSocialLinkSchema = z.object({
  body: z.object({
    platform: z.string().min(2, 'Platform is required'),
    username: z.string().min(1, 'Username is required'),
    url: z.string().min(1, 'URL is required'),
    active: z.boolean().default(true),
    displayOrder: z.number().int().default(0),
  }),
});

module.exports = {
  loginSchema,
  changePasswordSchema,
  createInquirySchema,
  updateInquiryStatusSchema,
  createContactSchema,
  createServiceSchema,
  updateServiceSchema,
  createProjectSchema,
  updateProjectSchema,
  createTestimonialSchema,
  updateBusinessSchema,
  createSocialLinkSchema,
};
