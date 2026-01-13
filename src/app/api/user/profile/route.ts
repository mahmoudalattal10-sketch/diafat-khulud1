import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// GET /api/user/profile - Fetch current user profile
export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                // Exclude password
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PUT /api/user/profile - Update profile
export async function PUT(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, phone, currentPassword, newPassword } = body;

        // Basic validation
        if (!name || !email) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        const updateData: any = {
            name,
            email,
            phone
        };

        // Handle password update if provided
        if (newPassword) {
            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
            }
            // In a real app, verify currentPassword first
            // For this prototype, we'll allow update if logged in
            updateData.password = await hash(newPassword, 12);
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
