import { prisma } from "@/lib/prisma";
import { updateTransaction } from "@/app/actions/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transaction-form";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export default async function EditTransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: id }
  });

  if (!transaction) {
    notFound();
  }

  const categories = await prisma.category.findMany();
  const accounts = await prisma.account.findMany({
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  });

  const updateAction = updateTransaction.bind(null, transaction.id);

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>编辑交易</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm 
            action={updateAction}
            categories={categories}
            accounts={accounts}
            currentUserId={session?.user?.id}
            defaultValues={{
              type: transaction.type,
              amount: transaction.amount,
              categoryId: transaction.categoryId,
              accountId: transaction.accountId,
              targetAccountId: transaction.targetAccountId,
              date: transaction.date,
              description: transaction.description,
            }}
            submitLabel="更新"
          />
        </CardContent>
      </Card>
    </div>
  );
}
