const prisma = require('./prisma');
const { hashPassword } = require('../utils/password');

async function seed() {
  console.log('[Seed] Seeding database...');

  // 1. Admin User
  const existingAdmin = await prisma.adminUser.findFirst({
    where: {
      OR: [{ username: 'admin' }, { email: 'admin@pirowoody.com' }],
    },
  });

  if (!existingAdmin) {
    const passwordHash = await hashPassword('AdminPassword2026!');
    const admin = await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: 'admin@pirowoody.com',
        fullName: 'Piro Woody Administrator',
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`[Seed] Created initial admin: ${admin.username} (email: ${admin.email})`);
  } else {
    console.log('[Seed] Admin user already exists.');
  }

  // 2. Business Information
  const existingBiz = await prisma.businessInformation.findFirst();
  if (!existingBiz) {
    await prisma.businessInformation.create({
      data: {
        businessName: 'Piro Woody Concepts',
        phone: '08137808170',
        whatsapp: '[TO BE PROVIDED]',
        email: '[TO BE PROVIDED]',
        address: '[TO BE PROVIDED]',
        businessHours: '[TO BE PROVIDED]',
        description: '[TO BE PROVIDED]',
        serviceAreas: [
          'Enugu',
          'Lagos',
          'Abuja',
          'Port Harcourt',
          'Nationwide and beyond',
        ],
      },
    });
    console.log('[Seed] Created business information.');
  } else {
    console.log('[Seed] Business information already exists.');
  }

  // 3. Initial Services
  const initialServices = [
    {
      name: 'Modern Kitchen Cabinetry & Transformation',
      slug: 'modern-kitchen-cabinetry-transformation',
      description: 'Custom kitchen layouts, premium moisture-resistant board selection, soft-close hardware, and precision installation tailored to modern architectural homes.',
      image: 'assets/images/kitchen-cabinetry.jpg',
      status: 'ACTIVE',
      displayOrder: 1,
    },
    {
      name: 'Bespoke Residential Furniture',
      slug: 'bespoke-residential-furniture',
      description: 'Handcrafted luxury dining sets, statement media consoles, designer bed frames, and ergonomic living accents built with rich walnut and hardwood veneers.',
      image: 'assets/images/bespoke-furniture.jpg',
      status: 'ACTIVE',
      displayOrder: 2,
    },
    {
      name: 'Integrated Smart Lighting Solutions',
      slug: 'integrated-smart-lighting-solutions',
      description: 'Concealed LED architectural channels, touchless sensory cabinetry illumination, and ambient mood accents seamlessly integrated into custom joinery.',
      image: 'assets/images/smart-lighting.jpg',
      status: 'ACTIVE',
      displayOrder: 3,
    },
    {
      name: 'Eco-Friendly & Sustainable Design',
      slug: 'eco-friendly-sustainable-design',
      description: 'Sustainably sourced certified hardwoods, non-toxic ultra-low VOC coatings, and energy-conscious manufacturing processes built for enduring beauty.',
      image: 'assets/images/woodwork-craftsmanship.jpg',
      status: 'ACTIVE',
      displayOrder: 4,
    },
    {
      name: 'Nationwide Logistics & Professional Installation',
      slug: 'nationwide-logistics-professional-installation',
      description: 'White-glove nationwide crating, protected transit, and on-site master joiner installation across Enugu, Lagos, Abuja, Port Harcourt, and beyond.',
      image: 'assets/images/hero-interior.jpg',
      status: 'ACTIVE',
      displayOrder: 5,
    },
  ];

  for (const s of initialServices) {
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });
    if (!existing) {
      await prisma.service.create({ data: s });
      console.log(`[Seed] Created service: ${s.name}`);
    }
  }

  // 4. Initial Social Links
  const initialSocials = [
    {
      platform: 'Facebook',
      username: 'Piro Woody Modern Interiors',
      url: 'https://www.facebook.com',
      active: true,
      displayOrder: 1,
    },
    {
      platform: 'Instagram',
      username: '@pirowoody',
      url: 'https://www.instagram.com',
      active: true,
      displayOrder: 2,
    },
    {
      platform: 'TikTok',
      username: '[TO BE PROVIDED]',
      url: '[TO BE PROVIDED]',
      active: false,
      displayOrder: 3,
    },
  ];

  for (const sl of initialSocials) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: sl.platform } });
    if (!existing) {
      await prisma.socialLink.create({ data: sl });
      console.log(`[Seed] Created social link: ${sl.platform}`);
    }
  }

  // 5. Initial Projects (Portfolio)
  const initialProjects = [
    {
      title: 'Minimalist Acrylic & Walnut Island Kitchen',
      slug: 'minimalist-acrylic-walnut-island-kitchen',
      category: 'Kitchen',
      description: 'Seamless handleless high-gloss acrylic cabinets paired with warm American walnut fluted island and integrated quartz waterfall countertops.',
      location: 'Enugu',
      coverImage: 'assets/images/kitchen-cabinetry.jpg',
      featured: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Architectural Master Walk-In Wardrobe',
      slug: 'architectural-master-walk-in-wardrobe',
      category: 'Wardrobe',
      description: 'Floor-to-ceiling smoked glass wardrobe enclosures with integrated warm LED motion-activated channels and velvet-lined jewelry drawers.',
      location: 'Lagos',
      coverImage: 'assets/images/luxury-wardrobe.jpg',
      featured: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Executive Walnut Wall Paneling & Media Suite',
      slug: 'executive-walnut-wall-paneling-media-suite',
      category: 'Living Room',
      description: 'Acoustic fluted walnut slat wall cladding with floating marble-topped entertainment credenza and smart ambient backlighting.',
      location: 'Abuja',
      coverImage: 'assets/images/bespoke-furniture.jpg',
      featured: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Bespoke Executive Boardroom & Office Suite',
      slug: 'bespoke-executive-boardroom-office-suite',
      category: 'Office',
      description: 'Custom 12-seater solid hardwood conference table with concealed cable routing and matching executive storage credenza.',
      location: 'Port Harcourt',
      coverImage: 'assets/images/woodwork-craftsmanship.jpg',
      featured: false,
      status: 'PUBLISHED',
    },
  ];

  for (const p of initialProjects) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      const created = await prisma.project.create({ data: p });
      await prisma.projectImage.create({
        data: {
          projectId: created.id,
          imageUrl: p.coverImage,
          altText: p.title,
          displayOrder: 1,
        },
      });
      console.log(`[Seed] Created project: ${p.title}`);
    }
  }

  console.log('[Seed] Database seeding completed successfully.');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed] Error during seeding:', err);
      process.exit(1);
    });
}

module.exports = seed;
