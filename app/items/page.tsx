import { getPhysicalItems, getFamilyMembers } from "@/app/actions/physical-item";
import { ItemList } from "@/components/items/item-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ItemsPage() {
  const [items, familyMembers] = await Promise.all([
    getPhysicalItems(),
    getFamilyMembers()
  ]);

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-8 px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">归物</h1>
          <p className="text-muted-foreground mt-1">
            管理您的实物资产，追踪使用价值。
          </p>
        </div>
        {items.length > 0 && (
          <Link href="/items/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              添加物品
            </Button>
          </Link>
        )}
      </div>

      <ItemList items={items} familyMembers={familyMembers} />
    </div>
  );
}
