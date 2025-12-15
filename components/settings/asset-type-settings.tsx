'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAssetTypes, createAssetType, deleteAssetType } from "@/app/actions/asset-type";
import { getGoldPrice } from "@/app/actions/gold-price";
import { useToast } from "@/hooks/use-toast";

export function AssetTypeSettings() {
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [goldPrice, setGoldPrice] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTypes();
    fetchGoldPrice();
  }, []);

  async function fetchGoldPrice() {
    const res = await getGoldPrice();
    if (res.success && res.price) {
      setGoldPrice(res.price);
    }
  }

  async function loadTypes() {
    try {
      const data = await getAssetTypes();
      setTypes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: FormData) {
    try {
      await createAssetType(formData);
      setIsDialogOpen(false);
      loadTypes();
      toast({
        title: "成功",
        description: "资产类型已添加",
      });
    } catch (error) {
      toast({
        title: "失败",
        description: "添加资产类型失败",
        variant: "destructive",
      });
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    
    try {
      await deleteAssetType(deleteId);
      loadTypes();
      toast({
        title: "成功",
        description: "资产类型已删除",
      });
    } catch (error: any) {
      // Extract error message from the Error object
      const errorMessage = error.message.includes('Cannot delete type that is in use') 
        ? "无法删除：该类型下仍有资产，请先删除相关资产。" 
        : (error.message || "删除资产类型失败");

      toast({
        title: "删除失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const FIXED_CODES = ['HK_STOCK', 'US_STOCK', 'CN_STOCK', 'REAL_ESTATE', 'PHYSICAL_GOLD', 'FUND', 'SILVER'];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>资产类型管理</CardTitle>
            <CardDescription>自定义您的资产分类</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> 添加类型
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加资产类型</DialogTitle>
                <DialogDescription>
                  创建一个新的资产类型以便在添加资产时使用。
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名称</Label>
                  <Input id="name" name="name" placeholder="例如：数字货币" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">代码 (英文)</Label>
                  <Input id="code" name="code" placeholder="例如：CRYPTO" required pattern="[A-Za-z0-9_]+" />
                  <p className="text-xs text-muted-foreground">仅允许字母、数字和下划线</p>
                </div>
                <DialogFooter>
                  <Button type="submit">保存</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {types.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    {type.name}
                    {type.code === 'PHYSICAL_GOLD' && goldPrice && (
                      <span className="ml-2 text-sm text-green-600">
                        (实时金价: ¥{goldPrice}/g)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{type.code}</div>
                </div>
                {!FIXED_CODES.includes(type.code) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(type.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除这个资产类型吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。如果该类型下还有资产，删除将会失败。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
