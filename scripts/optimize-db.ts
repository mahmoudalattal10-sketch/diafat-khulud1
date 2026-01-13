import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Optimizing SQLite database...');

    try {
        // Enable Write-Ahead Logging (WAL) mode
        // critically important for concurrency on SQLite
        await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
        console.log('✅ WAL mode enabled.');

        // Set synchronous mode to NORMAL for better performance while maintaining safety
        await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');
        console.log('✅ Synchronous mode set to NORMAL.');

        // Increase cache size (optional, but good for performance)
        // await prisma.$queryRawUnsafe('PRAGMA cache_size = -20000;'); // ~20MB

        console.log('🎉 Database optimization complete!');
    } catch (error) {
        console.error('❌ Error optimizing database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
