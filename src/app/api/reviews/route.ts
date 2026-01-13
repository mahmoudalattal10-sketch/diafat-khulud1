import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

// GET /api/reviews?hotelId=1
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
        return NextResponse.json({ error: 'Hotel ID is required' }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { hotelId: Number(hotelId) },
            include: {
                user: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST /api/reviews
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { hotelId, rating, comment } = body;

        if (!hotelId || !rating || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const review = await prisma.review.create({
            data: {
                hotelId: Number(hotelId),
                userId: session.user.id,
                rating: Number(rating),
                comment: comment,
            }
        });

        // Optional: Update hotel average rating (simple implementation)
        const aggregations = await prisma.review.aggregate({
            where: { hotelId: Number(hotelId) },
            _avg: { rating: true },
            _count: { rating: true }
        });

        await prisma.hotel.update({
            where: { id: Number(hotelId) },
            data: {
                rating: aggregations._avg.rating || 0,
                reviews: aggregations._count.rating || 0
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}
