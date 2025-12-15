'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '邮箱或密码错误';
        default:
          return '发生了一些错误';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    return '字段无效，注册失败';
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return '该邮箱已被注册';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return '创建用户失败';
  }

  // Attempt to sign in after registration
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return '邮箱或密码错误';
          default:
            return '发生了一些错误';
        }
      }
      throw error;
  }
}
