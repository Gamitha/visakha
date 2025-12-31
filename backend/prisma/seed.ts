import { prisma } from '../src/services/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
    console.log('🌱 Seeding database...');

    // Create super admin user if not exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@visakha.lk' },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('password123', 10);

        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: 'admin@visakha.lk',
                password: hashedPassword,
                isSuperAdmin: true,
                isActive: true,
                mustChangePassword: false,
            },
        });

        console.log('✅ Created super admin user: admin@visakha.lk');
    } else {
        console.log('ℹ️  Super admin user already exists');
    }

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
