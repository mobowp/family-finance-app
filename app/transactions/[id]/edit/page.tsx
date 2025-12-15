import { prisma } from "@/lib/prisma";
import { updateTransaction } from "@/app/actions/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionForm } from "@/components/transaction-form";
import { notFound } from "next/navigation";

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id }
  });

  if (!transaction) {
    notFound();
  }

  const categories = await prisma.category.findMany();
  const accounts = await prisma.account.findMany();

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
            defaultValues={{
              type: transaction.type,
              amount: transaction.amount,
              categoryId: transaction.categoryId,
              accountId: transaction.accountId,
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
