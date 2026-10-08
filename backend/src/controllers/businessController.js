const prisma = require('../config/prisma');
const { successResponse, errorResponse } = require('../utils/response');

// Public: GET /api/business
const getBusinessInfo = async (req, res, next) => {
  try {
    let biz = await prisma.businessInformation.findFirst();
    if (!biz) {
      biz = await prisma.businessInformation.create({
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
    }
    return successResponse(res, biz, 'Business information retrieved');
  } catch (error) {
    next(error);
  }
};

// Admin: PATCH /api/admin/business
const adminUpdateBusinessInfo = async (req, res, next) => {
  try {
    let biz = await prisma.businessInformation.findFirst();
    let updated;

    if (!biz) {
      updated = await prisma.businessInformation.create({ data: req.body });
    } else {
      updated = await prisma.businessInformation.update({
        where: { id: biz.id },
        data: req.body,
      });
    }

    return successResponse(res, updated, 'Business information updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinessInfo,
  adminUpdateBusinessInfo,
};
