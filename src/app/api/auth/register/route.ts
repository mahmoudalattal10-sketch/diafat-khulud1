import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        const result = signupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { name, email, password, phone } = result.data;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'البريد الإلكتروني مسجل بالفعل' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // @ts-ignore
                phone: phone || '',
                role: 'USER', // Default role
            },
        });

        // Don't return the password
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'حدث خطأ أثناء إنشاء الحساب' },
            { status: 500 }
        );
    }
}
