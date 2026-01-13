// Production Database Setup Script
// Run this on Hostinger SSH after deployment

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Hotel data (simplified version for seeding)
const HOTELS_DATA = [
    {
        name: 'فوربوينتس شيراتون النسيم',
        location: 'الطريق الدائري الثالث، حي النسيم، مكة المكرمة',
        latitude: 21.396347,
        longitude: 39.859124,
        distance: '8 كم من الحرم',
        rating: 8.5,
        price: 850,
        description: 'فندق عصري يوفر خدمة نقل مجانية للحرم',
        images: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1080']),
        badge: 'خدمة نقل',
        features: JSON.stringify(['خدمة نقل مجانية', 'إفطار متميز']),
        isFeatured: true,
        timeInMinutes: 15
    },
    {
        name: 'ميلينيوم مكة المكرمة النسيم',
        location: 'مجمع الراجحي، الطريق الدائري الثالث، مكة المكرمة',
        latitude: 21.396568,
        longitude: 39.858952,
        distance: '7.5 كم من الحرم',
        rating: 8.2,
        price: 780,
        description: 'فندق فاخر مع خدمات متكاملة',
        images: JSON.stringify(['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1080']),
        badge: 'خيار شائع',
        features: JSON.stringify(['خدمة نقل منتظمة', 'بوفيه متنوع']),
        isFeatured: true,
        timeInMinutes: 14
    },
    {
        name: 'المروة ريحان من روتانا',
        location: 'شارع أجياد، أبراج البيت، مكة المكرمة',
        latitude: 21.418961,
        longitude: 39.825763,
        distance: '50 متر من الحرم',
        rating: 9.2,
        price: 2500,
        description: 'فندق فاخر في قلب الحرم مع إطلالات استثنائية',
        images: JSON.stringify(['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1080']),
        badge: 'إطلالة على الحرم',
        features: JSON.stringify(['في برج الساعة', 'إطلالة مباشرة']),
        isFeatured: true,
        timeInMinutes: 1
    },
    {
        name: 'فندق أنجم مكة المكرمة',
        location: 'شارع جبل الكعبة، حي جرول، مكة المكرمة',
        latitude: 21.425464,
        longitude: 39.821422,
        distance: '150 متر من الحرم',
        rating: 8.8,
        price: 1800,
        description: 'فندق راقي مع نفق خاص للحرم',
        images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1080']),
        badge: 'نفق خاص',
        features: JSON.stringify(['موقع ممتاز', 'نفق خاص']),
        isFeatured: true,
        timeInMinutes: 3
    },
    {
        name: 'دار الإيمان رويال',
        location: 'المنطقة المركزية، المدينة المنورة',
        latitude: 24.4672,
        longitude: 39.6112,
        distance: '100 متر من المسجد النبوي',
        rating: 9.0,
        price: 1600,
        description: 'فندق فاخر بجوار المسجد النبوي مباشرة',
        images: JSON.stringify(['https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1080']),
        badge: 'بجوار المسجد النبوي',
        features: JSON.stringify(['إطلالة على الحرم', 'مطعم فاخر']),
        isFeatured: true,
        timeInMinutes: 2
    }
];

async function main() {
    console.log('🚀 Setting up production database...\n');

    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@diafat.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'مدير النظام',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('✅ Admin created: admin@diafat.com / admin123\n');
    } else {
        await prisma.user.update({
            where: { email: adminEmail },
            data: { password: hashedPassword, role: 'ADMIN' }
        });
        console.log('✅ Admin password updated\n');
    }

    // 2. Seed Hotels
    console.log('🏨 Seeding hotels...');
    for (const hotel of HOTELS_DATA) {
        const existing = await prisma.hotel.findFirst({
            where: { name: hotel.name }
        });

        if (!existing) {
            await prisma.hotel.create({ data: hotel });
            console.log(`  ✓ Added: ${hotel.name}`);
        } else {
            console.log(`  → Exists: ${hotel.name}`);
        }
    }

    console.log('\n✅ Database setup complete!');
    console.log('═══════════════════════════════════════');
    console.log('Admin Login: admin@diafat.com');
    console.log('Password: admin123');
    console.log('═══════════════════════════════════════');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
