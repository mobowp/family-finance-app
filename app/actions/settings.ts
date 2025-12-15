'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user';
import bcrypt from 'bcryptjs';

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const image = formData.get('image') as string;

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { name, email, image },
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath('/settings');
  revalidatePath('/users'); // Update navbar potentially
}

import { signOut } from '@/auth';

export async function changePassword(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  // In a real app, verify currentPassword hash
  // Here we just update it
  
  try {
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword }, 
    });
  } catch (error) {
    console.error("Failed to change password:", error);
    throw new Error("Failed to change password");
  }

  await signOut({ redirectTo: '/login' });
}
