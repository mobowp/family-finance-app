-- CreateIndex
CREATE INDEX "Transaction_userId_type_date_idx" ON "Transaction"("userId", "type", "date" DESC);

-- CreateIndex
CREATE INDEX "Transaction_userId_categoryId_date_idx" ON "Transaction"("userId", "categoryId", "date" DESC);

-- CreateIndex
CREATE INDEX "Transaction_userId_accountId_date_idx" ON "Transaction"("userId", "accountId", "date" DESC);

-- CreateIndex
CREATE INDEX "User_familyId_idx" ON "User"("familyId");
