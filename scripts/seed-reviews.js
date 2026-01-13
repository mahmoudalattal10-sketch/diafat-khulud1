const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// مجموعة متنوعة من الأسماء العربية
const ARABIC_NAMES = [
    'أحمد محمد', 'محمد علي', 'خالد عبدالله', 'عبدالرحمن السعيد',
    'سارة أحمد', 'فاطمة محمد', 'نورة الحربي', 'مريم السالم',
    'عمر الفهد', 'يوسف الشمري', 'إبراهيم الرشيد', 'سلمان القحطاني',
    'هند المطيري', 'ريم الدوسري', 'عائشة العنزي', 'لينا السبيعي',
    'فهد الغامدي', 'سعود الزهراني', 'ناصر البريك', 'تركي العمري',
    'منى الحازمي', 'دانة القرني', 'لمى الشهري', 'ندى العتيبي'
];

// تقييمات إيجابية متنوعة
const POSITIVE_COMMENTS = [
    'فندق ممتاز! موقع رائع وقريب جداً من الحرم. الغرف نظيفة والخدمة ممتازة.',
    'تجربة رائعة! الطاقم ودود ومتعاون. سأعود بالتأكيد في زيارتي القادمة.',
    'موقع استراتيجي والخدمات ممتازة. الإفطار كان لذيذ ومتنوع.',
    'أفضل فندق أقمت فيه! النظافة على أعلى مستوى والغرف مريحة جداً.',
    'خدمة ممتازة من الاستقبال حتى المغادرة. أنصح به بشدة للعائلات.',
    'الموقع قريب من الحرم والمطاعم. الغرف واسعة ومجهزة بشكل ممتاز.',
    'تجربة لا تُنسى! الإطلالة على الحرم كانت مذهلة. شكراً على الضيافة الراقية.',
    'فندق فاخر بكل المقاييس. الخدمة سريعة والطاقم محترف.',
    'أقمت هنا لأداء العمرة وكانت تجربة رائعة. سأكررها بإذن الله.',
    'الغرف نظيفة جداً والسرير مريح. الموقع ممتاز للوصول للحرم مشياً.',
    'إقامة مميزة! الخدمة الممتازة والنظافة جعلت رحلتنا لا تُنسى.',
    'فندق يستحق كل ريال! الخدمة راقية والموظفين متعاونين جداً.'
];

// تقييمات متوسطة
const NEUTRAL_COMMENTS = [
    'فندق جيد بشكل عام. الموقع ممتاز لكن الإفطار يحتاج تحسين.',
    'الغرف نظيفة والموقع جيد. بعض الخدمات بطيئة قليلاً.',
    'تجربة مقبولة. السعر مناسب للخدمة المقدمة.',
    'فندق مناسب للميزانية. لا يوجد شكاوى كبيرة.',
    'الموظفين ودودين والغرف جيدة. المصعد كان بطيئاً قليلاً.'
];

async function main() {
    console.log('⭐ Adding guest reviews to all hotels...\n');

    // Get all hotels
    const hotels = await prisma.hotel.findMany();
    console.log(`Found ${hotels.length} hotels\n`);

    // Create some fake users for reviews
    const users = [];
    for (let i = 0; i < 10; i++) {
        const name = ARABIC_NAMES[i];
        const email = `user${i + 1}@example.com`;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'USER'
                }
            });
            console.log(`Created user: ${name}`);
        }
        users.push(user);
    }

    // Add reviews to each hotel
    for (const hotel of hotels) {
        // Check if hotel already has reviews
        const existingReviews = await prisma.review.count({
            where: { hotelId: hotel.id }
        });

        if (existingReviews > 0) {
            console.log(`⏭️ ${hotel.name} already has ${existingReviews} reviews, skipping...`);
            continue;
        }

        // Add 3-5 reviews per hotel
        const reviewCount = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < reviewCount; i++) {
            const user = users[Math.floor(Math.random() * users.length)];

            // Rating between 3-5 (mostly positive)
            const rating = Math.random() > 0.2 ? (4 + Math.floor(Math.random() * 2)) : 3;

            // Pick appropriate comment based on rating
            const comments = rating >= 4 ? POSITIVE_COMMENTS : NEUTRAL_COMMENTS;
            const comment = comments[Math.floor(Math.random() * comments.length)];

            // Random date in the past 6 months
            const daysAgo = Math.floor(Math.random() * 180);
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - daysAgo);

            await prisma.review.create({
                data: {
                    userId: user.id,
                    hotelId: hotel.id,
                    rating,
                    comment,
                    createdAt
                }
            });
        }
        console.log(`✓ Added ${reviewCount} reviews to: ${hotel.name}`);
    }

    console.log('\n✅ All reviews added successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Each hotel now has guest reviews with ratings and comments!');
    console.log('═══════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
