import User from '../models/userModel.js';

export const seedAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });

    if (adminCount === 0) {
      await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123!',
        isAdmin: true,
      });
      console.log('Admin user created!');
    }
  } catch (error) {
    console.error(`Error seeding admin user: ${error.message}`);
  }
};