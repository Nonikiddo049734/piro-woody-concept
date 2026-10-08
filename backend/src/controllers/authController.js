const prisma = require('../config/prisma');
const { comparePassword, hashPassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username }, { email: username.toLowerCase() }],
      },
    });

    if (!admin) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = signToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    });

    // Never expose password hash
    const userSafe = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    };

    return successResponse(
      res,
      { token, user: userSafe },
      'Authentication successful'
    );
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  return successResponse(res, req.admin, 'Profile retrieved');
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    const isMatch = await comparePassword(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Incorrect current password', 400);
    }

    const newHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: adminId },
      data: { passwordHash: newHash },
    });

    return successResponse(res, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully');
};

module.exports = {
  login,
  getProfile,
  changePassword,
  logout,
};
