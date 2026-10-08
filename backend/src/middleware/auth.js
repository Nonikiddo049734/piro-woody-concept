const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/prisma');
const { errorResponse } = require('../utils/response');

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired authentication token.', 401);
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    if (!admin) {
      return errorResponse(res, 'Admin user not found or inactive.', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authenticateAdmin,
};
