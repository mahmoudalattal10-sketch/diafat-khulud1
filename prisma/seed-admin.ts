import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@diafat.com';
    const adminPassword = 'admin123';

    console.log('Checking for existing admin...');
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log('Admin already exists. Updating password...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.update({
            where: { email: adminEmail },
            data: { password: hashedPassword, role: 'ADMIN' }
        });
        console.log('Admin password updated.');
        return;
    }

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
        data: {
            email: adminEmail,
            name: 'مدير النظام',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('Admin user created successfully!');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
