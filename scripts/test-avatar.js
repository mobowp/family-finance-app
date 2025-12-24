
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found");
    return;
  }

  console.log("Current avatar:", user.image ? user.image.substring(0, 50) + "..." : "null");

  // A small red dot base64
  const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  await prisma.user.update({
    where: { id: user.id },
    data: { image: base64Image }
  });

  const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log("Updated avatar:", updatedUser.image === base64Image ? "Match" : "Mismatch");
  console.log("Updated avatar content:", updatedUser.image);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
