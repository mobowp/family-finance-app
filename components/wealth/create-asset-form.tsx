'use client';

import { useRouter } from "next/navigation";
import { createAsset } from "@/app/actions/asset";
import { getGoldPrice } from "@/app/actions/gold-price";
import { getStockPrice } from "@/app/actions/stock-price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CreateAssetFormProps {
  assetTypes: any[];
  users?: { id: string; name: string | null; email: string }[];
}

export function CreateAssetForm({ assetTypes, users = [] }: CreateAssetFormProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [price, setPrice] = useState("");
  const [loadingPrice, setLoadingPrice] = useState(false);

  async function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const type = e.target.value;
    setSelectedType(type);

    if (type === 'PHYSICAL_GOLD') {
      fetchGoldPrice();
    }
  }

  async function fetchGoldPrice() {
    setLoadingPrice(true);
    try {
      const res = await getGoldPrice();
      if (res.success && res.price) {
        setPrice(res.price);
      }
    } catch (error) {
      console.error("Failed to fetch gold price", error);
    } finally {
      setLoadingPrice(false);
    }
  }

  async function handleSymbolBlur(e: React.FocusEvent<HTMLInputElement>) {
    const symbol = e.target.value;
    if (selectedType === 'HK_STOCK' && symbol) {
      setLoadingPrice(true);
      try {
        const res = await getStockPrice(symbol);
        if (res.success && res.price) {
          setPrice(res.price);
        }
      } catch (error) {
        console.error("Failed to fetch stock price", error);
      } finally {
        setLoadingPrice(false);
      }
    }
  }

  const STOCK_TYPES = ['HK_STOCK', 'US_STOCK', 'CN_STOCK', 'STOCK', 'FUND'];
  const showSymbol = STOCK_TYPES.includes(selectedType);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>添加资产</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAsset} className="space-y-4">
          {users.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="userId">归属人</Label>
              <select 
                name="userId" 
                id="userId" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              placeholder="例如：腾讯控股、自住房产" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">资产类型</Label>
            <select 
              name="type" 
              id="type" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="" disabled>选择类型</option>
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
                placeholder="Yahoo Finance代码 (如: 0700.HK, AAPL)" 
                onBlur={handleSymbolBlur}
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
                placeholder="0" 
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
                placeholder="0.00" 
                step="0.01" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketPrice">
                现在单价 (选填)
                {loadingPrice && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
              </Label>
              <Input 
                type="number" 
                id="marketPrice" 
                name="marketPrice" 
                placeholder="如果不填则默认等于成本价" 
                step="0.01"
                defaultValue={price}
                key={price} // Force re-render when price changes to update defaultValue
              />
              {selectedType === 'PHYSICAL_GOLD' && price && (
                <p className="text-xs text-green-600">已自动获取实时金价</p>
              )}
              {selectedType === 'HK_STOCK' && price && (
                <p className="text-xs text-green-600">已自动获取实时股价</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
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
              保存资产
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
