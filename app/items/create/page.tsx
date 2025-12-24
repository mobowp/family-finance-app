import { ItemForm } from "@/components/items/item-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getFamilyMembers } from "@/app/actions/physical-item";

export default async function CreateItemPage() {
  const familyMembers = await getFamilyMembers();

  return (
    <div className="container max-w-2xl py-8 mx-auto space-y-8 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/items">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">添加新物品</h1>
          <p className="text-muted-foreground">
            录入新的实物资产信息。
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <ItemForm familyMembers={familyMembers} />
      </div>
    </div>
  );
}
