'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Tv, Laptop, Camera, Tablet, Car, AirVent, Refrigerator, Headphones, 
  Smartphone, Watch, Gamepad, Speaker, Armchair, Bed, WashingMachine,
  Utensils, Bike, Calendar, ShieldCheck, FileText, Pencil
} from "lucide-react";
import { differenceInDays, format, formatDistanceToNow, isBefore } from "date-fns";
import { zhCN } from "date-fns/locale";
import Link from "next/link";

const ICONS: Record<string, any> = {
  tv: Tv,
  laptop: Laptop,
  camera: Camera,
  tablet: Tablet,
  smartphone: Smartphone,
  car: Car,
  "air-vent": AirVent,
  refrigerator: Refrigerator,
  "washing-machine": WashingMachine,
  headphones: Headphones,
  watch: Watch,
  gamepad: Gamepad,
  speaker: Speaker,
  furniture: Armchair,
  bed: Bed,
  kitchen: Utensils,
  bike: Bike,
};

interface PhysicalItemProps {
  item: {
    id: string;
    name: string;
    icon: string;
    image: string | null;
    price: number;
    purchaseDate: Date;
    warrantyDate: Date | null;
    status: string;
    note: string | null;
    updatedAt: Date;
  };
}

export function ItemCard({ item }: PhysicalItemProps) {
  const Icon = ICONS[item.icon] || Tv;
  const today = new Date();
  const purchaseDate = new Date(item.purchaseDate);
  
  // Calculate end date for daily cost
  // If retired, use updatedAt as the retirement date (approximation)
  const endDate = item.status === 'RETIRED' ? new Date(item.updatedAt) : today;
  
  const daysOwned = differenceInDays(endDate, purchaseDate);
  // Avoid division by zero, at least 1 day
  const effectiveDays = daysOwned < 1 ? 1 : daysOwned;
  
  const dailyCost = item.price / effectiveDays;

  const isWarrantyExpired = item.warrantyDate ? isBefore(new Date(item.warrantyDate), today) : false;
  
  const getWarrantyText = () => {
    if (!item.warrantyDate) return "无保修信息";
    const date = new Date(item.warrantyDate);
    if (isWarrantyExpired) {
        return `已过期 ${formatDistanceToNow(date, { locale: zhCN })}`;
    }
    return `还有 ${formatDistanceToNow(date, { locale: zhCN })} 到期`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group/card border-slate-200/60 dark:border-slate-800/60">
      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
        ) : (
          <Icon className="h-16 w-16 text-slate-300 dark:text-slate-600" />
        )}
        <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Link href={`/items/${item.id}/edit`}>
                <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm">
                    <Pencil className="h-3 w-3 text-slate-700" />
                </Button>
            </Link>
            <Badge variant={item.status === 'ACTIVE' ? 'default' : 'secondary'} className={item.status === 'ACTIVE' ? "bg-green-500/90 hover:bg-green-600 backdrop-blur-sm" : "backdrop-blur-sm"}>
                {item.status === 'ACTIVE' ? '使用中' : '已退役'}
            </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                    <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium truncate">{item.name}</span>
            </div>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">总投入</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">¥{item.price.toLocaleString()}</p>
            </div>
            <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground">日均成本</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">¥{dailyCost.toFixed(2)}</p>
            </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>购买日期</span>
                </div>
                <span className="font-medium">{format(purchaseDate, 'yyyy-MM-dd')}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>保修状态</span>
                </div>
                <span className={`font-medium ${isWarrantyExpired ? "text-red-500" : "text-green-600"}`}>
                    {getWarrantyText()}
                </span>
            </div>
        </div>

        {item.note && (
            <div className="pt-2">
                <div className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 mb-1 font-medium text-slate-700 dark:text-slate-300">
                        <FileText className="h-3 w-3" />
                        备注
                    </div>
                    <p className="line-clamp-2">{item.note}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
