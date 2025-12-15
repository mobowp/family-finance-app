'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const FIXED_TYPES = [
  { name: '港股', code: 'HK_STOCK' },
  { name: '美股', code: 'US_STOCK' },
  { name: 'A股', code: 'CN_STOCK' },
  { name: '房产', code: 'REAL_ESTATE' },
  { name: '实物黄金', code: 'PHYSICAL_GOLD' },
  { name: '基金', code: 'FUND' },
  { name: '白银', code: 'SILVER' },
];

export async function getAssetTypes() {
  // Fetch all existing types first
  const existingTypes = await prisma.assetType.findMany();
  const existingCodes = new Set(existingTypes.map(t => t.code));

  // Find missing fixed types
  const missingTypes = FIXED_TYPES.filter(t => !existingCodes.has(t.code));

  // Create missing types if any
  if (missingTypes.length > 0) {
    for (const type of missingTypes) {
      await prisma.assetType.create({ data: type });
    }
    
    // Re-fetch to get the complete list including newly created ones
    const allTypes = await prisma.assetType.findMany();
    return sortTypes(allTypes);
  }

  return sortTypes(existingTypes);
}

function sortTypes(types: any[]) {
  const fixedCodes = FIXED_TYPES.map(t => t.code);
  
  const fixedTypes = types.filter(t => fixedCodes.includes(t.code));
  const customTypes = types.filter(t => !fixedCodes.includes(t.code));
  
  // Sort fixed types based on the order in FIXED_TYPES array
  fixedTypes.sort((a, b) => {
    return fixedCodes.indexOf(a.code) - fixedCodes.indexOf(b.code);
  });
  
  // Sort custom types by creation time
  customTypes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  
  return [...fixedTypes, ...customTypes];
}

export async function createAssetType(formData: FormData) {
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;

  if (!name || !code) {
    throw new Error('Name and Code are required');
  }

  // Check if code conflicts with fixed types
  if (FIXED_TYPES.some(t => t.code === code.toUpperCase())) {
    throw new Error('Cannot use reserved code');
  }

  await prisma.assetType.create({
    data: {
      name,
      code: code.toUpperCase(),
    },
  });

  revalidatePath('/settings');
  revalidatePath('/assets/create');
}

export async function deleteAssetType(id: string) {
  const type = await prisma.assetType.findUnique({ where: { id } });
  if (!type) return;

  // Prevent deleting fixed types
  if (FIXED_TYPES.some(t => t.code === type.code)) {
    throw new Error('Cannot delete fixed asset type');
  }

  // Check if any assets are using this type
  const count = await prisma.asset.count({
    where: { type: type.code }
  });

  if (count > 0) {
    throw new Error('Cannot delete type that is in use');
  }

  await prisma.assetType.delete({
    where: { id }
  });

  revalidatePath('/settings');
  revalidatePath('/assets/create');
}
