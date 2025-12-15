'use client';

import { useRouter } from "next/navigation";
import { updateAsset } from "@/app/actions/asset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";

interface EditAssetFormProps {
  asset: any;
  assetTypes: any[];
  users?: { id: string; name: string | null; email: string }[];
}

export function EditAssetForm({ asset, assetTypes, users = [] }: EditAssetFormProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(asset.type);
  
  const updateAssetWithId = updateAsset.bind(null, asset.id);

  const STOCK_TYPES = ['HK_STOCK', 'US_STOCK', 'CN_STOCK', 'STOCK', 'FUND'];
  const showSymbol = STOCK_TYPES.includes(selectedType);

  return (
    <form action={updateAssetWithId} className="space-y-4">
      {users.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="userId">归属人</Label>
          <select 
            name="userId" 
            id="userId" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            defaultValue={asset.userId}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">资产名称</Label>
        <Input 
          type="text" 
          id="name" 
          name="name" 
          defaultValue={asset.name}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">资产类型</Label>
        <select 
          name="type" 
          id="type" 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          {assetTypes.map((type: any) => (
            <option key={type.id} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {showSymbol && (
        <div className="space-y-2">
          <Label htmlFor="symbol">代码 (选填)</Label>
          <Input 
            type="text" 
            id="symbol" 
            name="symbol" 
            defaultValue={asset.symbol || ''}
            placeholder="Yahoo Finance代码 (如: 0700.HK, AAPL)" 
          />
          <p className="text-xs text-muted-foreground">填写代码可自动更新行情 (股票/ETF)</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">持仓数量</Label>
          <Input 
            type="number" 
            id="quantity" 
            name="quantity" 
            defaultValue={asset.quantity}
            step="0.0001" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">成本单价</Label>
          <Input 
            type="number" 
            id="costPrice" 
            name="costPrice" 
            defaultValue={asset.costPrice}
            step="0.01" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketPrice">现在单价 (选填)</Label>
          <Input 
            type="number" 
            id="marketPrice" 
            name="marketPrice" 
            defaultValue={asset.marketPrice || asset.costPrice}
            step="0.01" 
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => {
              router.push('/wealth?tab=assets');
              router.refresh();
            }}
          >
            取消
          </Button>
          <Button type="submit" className="w-full">
            保存修改
          </Button>
      </div>
    </form>
  );
}
