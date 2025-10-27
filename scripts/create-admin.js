const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurants';

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    full_name: String,
    is_admin: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = process.argv[2] || 'admin@example.com';
        const password = process.argv[3] || 'admin123';
        const fullName = process.argv[4] || 'Admin User';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User with email ${email} already exists!`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await User.create({
            email,
            password: hashedPassword,
            full_name: fullName,
            is_admin: true,
        });

        console.log('Admin user created successfully!');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
