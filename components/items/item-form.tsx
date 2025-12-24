'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createPhysicalItem, updatePhysicalItem } from "@/app/actions/physical-item";
import { useState, useRef } from "react";
import { 
  Tv, Laptop, Camera, Tablet, Car, AirVent, Refrigerator, Headphones, 
  Smartphone, Watch, Gamepad, Speaker, Armchair, Bed, WashingMachine,
  Utensils, Bike, Upload, ImageIcon, Loader2, X, User
} from "lucide-react";
import Link from "next/link";

const ICONS = [
  { name: "tv", label: "电视", icon: Tv },
  { name: "laptop", label: "笔记本", icon: Laptop },
  { name: "camera", label: "相机", icon: Camera },
  { name: "tablet", label: "iPad/平板", icon: Tablet },
  { name: "smartphone", label: "手机", icon: Smartphone },
  { name: "car", label: "汽车", icon: Car },
  { name: "air-vent", label: "空调", icon: AirVent },
  { name: "refrigerator", label: "冰箱", icon: Refrigerator },
  { name: "washing-machine", label: "洗衣机", icon: WashingMachine },
  { name: "headphones", label: "耳机", icon: Headphones },
  { name: "watch", label: "手表", icon: Watch },
  { name: "gamepad", label: "游戏机", icon: Gamepad },
  { name: "speaker", label: "音响", icon: Speaker },
  { name: "furniture", label: "家具", icon: Armchair },
  { name: "bed", label: "床具", icon: Bed },
  { name: "kitchen", label: "厨具", icon: Utensils },
  { name: "bike", label: "自行车", icon: Bike },
];

interface ItemFormProps {
  initialData?: {
    id: string;
    name: string;
    icon: string;
    image: string | null;
    price: number;
    purchaseDate: Date;
    warrantyDate: Date | null;
    status: string;
    note: string | null;
    user?: {
        id: string;
    };
  };
  familyMembers?: {
    id: string;
    name: string | null;
    image: string | null;
  }[];
}

export function ItemForm({ initialData, familyMembers = [] }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialData?.image || null);
  const [isRetired, setIsRetired] = useState(initialData?.status === 'RETIRED');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("请上传图片文件");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        const maxSize = 800; // Larger than avatar
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        try {
          if (initialData) {
            await updatePhysicalItem(initialData.id, formData);
          } else {
            await createPhysicalItem(formData);
          }
        } catch (error: any) {
          if (error.message === 'NEXT_REDIRECT') {
            throw error;
          }
          alert(initialData ? "更新失败，请重试" : "添加失败，请重试");
          console.error(error);
          setLoading(false);
        }
      }} 
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">资产名称</Label>
        <Input 
          id="name" 
          name="name" 
          required 
          placeholder="例如：MacBook Pro" 
          defaultValue={initialData?.name}
        />
      </div>

      {familyMembers.length > 0 && (
        <div className="space-y-2">
            <Label>归属人</Label>
            <Select name="ownerId" defaultValue={initialData?.user?.id}>
                <SelectTrigger>
                    <SelectValue placeholder="选择归属人" />
                </SelectTrigger>
                <SelectContent>
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
      )}

      <div className="space-y-2">
        <Label>图标类型</Label>
        <Select name="icon" defaultValue={initialData?.icon || "tv"}>
          <SelectTrigger>
            <SelectValue placeholder="选择图标" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {ICONS.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>实物图片（可选）</Label>
        <input type="hidden" name="image" value={selectedImage || ''} />
        <div className="flex items-center gap-4">
          <div 
            className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                <div 
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    title="移除图片"
                >
                    <X className="h-3 w-3" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">上传</span>
              </div>
            )}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${selectedImage ? 'pointer-events-none' : ''}`}>
               <Upload className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
             <p>支持 JPG, PNG 格式</p>
             <p>点击图片可重新上传</p>
          </div>
          <input
             ref={fileInputRef}
             type="file"
             accept="image/*"
             onChange={handleFileUpload}
             className="hidden"
           />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">总价格</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            required 
            placeholder="0.00" 
            defaultValue={initialData?.price}
          />
        </div>
        <div className="space-y-2">
            <Label htmlFor="purchaseDate">购买日期</Label>
            <Input 
                id="purchaseDate" 
                name="purchaseDate" 
                type="date" 
                required 
                defaultValue={initialData 
                  ? new Date(new Date(initialData.purchaseDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
                }
            />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="warrantyDate">保修到期时间（可选）</Label>
        <Input 
          id="warrantyDate" 
          name="warrantyDate" 
          type="date" 
          defaultValue={initialData?.warrantyDate 
            ? new Date(new Date(initialData.warrantyDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
            : undefined
          }
        />
      </div>

      <div className="flex items-center space-x-2">
          <Checkbox 
            id="status" 
            checked={isRetired} 
            onCheckedChange={(checked) => setIsRetired(checked as boolean)} 
          />
          <Label htmlFor="status" className="cursor-pointer">是否已退役</Label>
          <input type="hidden" name="status" value={isRetired ? "RETIRED" : "ACTIVE"} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">备注信息</Label>
        <Textarea 
          id="note" 
          name="note" 
          placeholder="填写更多详细信息..." 
          defaultValue={initialData?.note || ''}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Link href="/items" className="w-full">
          <Button type="button" variant="outline" className="w-full" disabled={loading}>
            取消
          </Button>
        </Link>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            initialData ? "确认更新" : "确认添加"
          )}
        </Button>
      </div>
    </form>
  );
}
