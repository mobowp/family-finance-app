/*
  Warnings:

  - You are about to drop the `SystemSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dataSource` on the `Asset` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SystemSetting";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AssetType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "symbol" TEXT,
    "quantity" REAL NOT NULL,
    "costPrice" REAL NOT NULL,
    "marketPrice" REAL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("costPrice", "createdAt", "id", "marketPrice", "name", "quantity", "symbol", "type", "updatedAt", "userId") SELECT "costPrice", "createdAt", "id", "marketPrice", "name", "quantity", "symbol", "type", "updatedAt", "userId" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AssetType_code_key" ON "AssetType"("code");
