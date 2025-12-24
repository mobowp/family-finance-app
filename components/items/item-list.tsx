'use client';

import { ItemCard } from "./item-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Plus, User, Users } from "lucide-react";
import { useState, useMemo } from "react";

interface ItemListProps {
  items: any[];
  familyMembers?: {
    id: string;
    name: string | null;
    image: string | null;
  }[];
}

export function ItemList({ items, familyMembers = [] }: ItemListProps) {
  const [selectedOwner, setSelectedOwner] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (selectedOwner === "all") return items;
    return items.filter(item => item.userId === selectedOwner);
  }, [items, selectedOwner]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
            <Plus className="h-8 w-8 text-slate-400" />
        </div>
        <div className="space-y-2">
            <h3 className="text-lg font-medium">暂无物品</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                记录您的家庭资产，追踪使用成本和保修状态。
            </p>
        </div>
        <Link href="/items/create">
            <Button>添加第一个物品</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {familyMembers.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-[180px]">
                <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                    <SelectTrigger className="w-full">
                         <div className="flex items-center gap-2">
                            {selectedOwner === "all" ? (
                                <Users className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <User className="h-4 w-4 text-muted-foreground" />
                            )}
                            <SelectValue placeholder="筛选归属人" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Users className="h-3 w-3 text-slate-500" />
                                </div>
                                <span>全部成员</span>
                            </div>
                        </SelectItem>
                        {familyMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name || 'User'} className="w-5 h-5 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                                            <User className="h-3 w-3 text-slate-500" />
                                        </div>
                                    )}
                                    <span>{member.name || '家庭成员'}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
        
        {/* Only show "Add New" card when showing all items or if user wants to add item for specific person (though add page defaults to current user) */}
        <Link href="/items/create" className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-blue-500/50 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:border-blue-500/50 transition-all duration-300 min-h-[300px]">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-6 w-6 text-blue-500" />
          </div>
          <p className="font-medium text-slate-600 dark:text-slate-400">添加新物品</p>
        </Link>
      </div>
    </div>
  );
}
