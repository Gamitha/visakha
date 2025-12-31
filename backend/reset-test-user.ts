
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function reset() {
    const email = 'test@example.com';
    const password = await bcrypt.hash('password123', 10);

    await prisma.user.update({
        where: { email },
        data: {
            password,
            mustChangePassword: true
        }
    });
    console.log('Reset complete');
}

reset()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
