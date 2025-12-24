'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user';
import { redirect } from 'next/navigation';

export async function createPhysicalItem(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const name = formData.get('name') as string;
  const icon = formData.get('icon') as string;
  const image = formData.get('image') as string;
  const price = parseFloat(formData.get('price') as string);
  const purchaseDate = new Date(formData.get('purchaseDate') as string);
  const warrantyDateStr = formData.get('warrantyDate') as string;
  const warrantyDate = warrantyDateStr ? new Date(warrantyDateStr) : null;
  const note = formData.get('note') as string;
  const status = formData.get('status') as string || 'ACTIVE';
  
  // Get ownerId if provided, otherwise default to current user
  let ownerId = formData.get('ownerId') as string;
  
  // Validate ownerId belongs to family
  if (ownerId && ownerId !== user.id) {
    // If not current user, verify they are in the same family
    const targetUser = await prisma.user.findUnique({
      where: { id: ownerId }
    });
    
    // @ts-ignore
    const userFamilyId = user.familyId || user.id;
    // @ts-ignore
    const targetFamilyId = targetUser?.familyId || targetUser?.id;
    
    if (userFamilyId !== targetFamilyId) {
        throw new Error("Cannot assign to user outside family");
    }
  } else {
      ownerId = user.id;
  }

  if (!name || isNaN(price) || !purchaseDate) {
      throw new Error("Missing required fields");
  }

  await prisma.physicalItem.create({
    data: {
      name,
      icon,
      image: image || null,
      price,
      purchaseDate,
      warrantyDate,
      status,
      note: note || null,
      userId: ownerId, // Use the selected owner as userId
    },
  });

  revalidatePath('/items');
  redirect('/items');
}

export async function getPhysicalItems() {
  const user = await getCurrentUser();
  if (!user) return [];

  // @ts-ignore
  const familyId = user.familyId || user.id;

  // Find all users in the family
  const familyUsers = await prisma.user.findMany({
    where: {
      OR: [
        { id: familyId },
        { familyId: familyId }
      ]
    },
    select: { id: true }
  });

  const familyUserIds = familyUsers.map(u => u.id);

  return prisma.physicalItem.findMany({
    where: { 
        userId: { in: familyUserIds }
    },
    orderBy: { purchaseDate: 'desc' },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                image: true
            }
        }
    }
  });
}

export async function getPhysicalItem(id: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    // @ts-ignore
    const familyId = user.familyId || user.id;

    // Find all users in the family
    const familyUsers = await prisma.user.findMany({
      where: {
        OR: [
          { id: familyId },
          { familyId: familyId }
        ]
      },
      select: { id: true }
    });
  
    const familyUserIds = familyUsers.map(u => u.id);

    return prisma.physicalItem.findFirst({
        where: {
            id,
            userId: { in: familyUserIds }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });
}

export async function updatePhysicalItem(id: string, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const image = formData.get('image') as string;
    const price = parseFloat(formData.get('price') as string);
    const purchaseDate = new Date(formData.get('purchaseDate') as string);
    const warrantyDateStr = formData.get('warrantyDate') as string;
    const warrantyDate = warrantyDateStr ? new Date(warrantyDateStr) : null;
    const note = formData.get('note') as string;
    const status = formData.get('status') as string || 'ACTIVE';
    
    // Get ownerId if provided
    const ownerId = formData.get('ownerId') as string;

    if (!name || isNaN(price) || !purchaseDate) {
        throw new Error("Missing required fields");
    }

    // Verify permission (must be family member)
    const existingItem = await getPhysicalItem(id);
    if (!existingItem) throw new Error("Item not found or unauthorized");

    const data: any = {
        name,
        icon,
        image: image || null,
        price,
        purchaseDate,
        warrantyDate,
        status,
        note: note || null,
    };

    if (ownerId && ownerId !== existingItem.userId) {
         // If owner changing, verify target user is in family
         const targetUser = await prisma.user.findUnique({
            where: { id: ownerId }
          });
          
          // @ts-ignore
          const userFamilyId = user.familyId || user.id;
          // @ts-ignore
          const targetFamilyId = targetUser?.familyId || targetUser?.id;
          
          if (userFamilyId !== targetFamilyId) {
              throw new Error("Cannot assign to user outside family");
          }
          data.userId = ownerId;
    }

    await prisma.physicalItem.update({
        where: { id },
        data,
    });

    revalidatePath('/items');
    redirect('/items');
}

export async function deletePhysicalItem(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    // Verify permission via getPhysicalItem which checks family
    const existingItem = await getPhysicalItem(id);
    if (!existingItem) throw new Error("Item not found or unauthorized");

    await prisma.physicalItem.delete({
        where: { id }
    });

    revalidatePath('/items');
    redirect('/items');
}

export async function updatePhysicalItemStatus(id: string, status: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    const existingItem = await getPhysicalItem(id);
    if (!existingItem) throw new Error("Item not found or unauthorized");

    await prisma.physicalItem.update({
        where: { id },
        data: { status }
    });

    revalidatePath('/items');
}

export async function getFamilyMembers() {
    const user = await getCurrentUser();
    if (!user) return [];
  
    // @ts-ignore
    const familyId = user.familyId || user.id;
  
    return prisma.user.findMany({
      where: {
        OR: [
          { id: familyId },
          { familyId: familyId }
        ]
      },
      select: {
        id: true,
        name: true,
        image: true
      }
    });
  }
