'use client';

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssetsForUpdate, updateSingleAssetPrice, revalidateAssets, updateBatchGoldPrices } from "@/app/actions/asset";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RefreshAssetButton() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: "", message: "" });

  const handleRefresh = async () => {
    setLoading(true);
    setProgress("准备中...");
    try {
      const assets = await getAssetsForUpdate();
      let updatedCount = 0;
      const total = assets.length;

      // 1. Filter and process Gold assets in batch
      const goldAssets = assets.filter(a => a.type === 'PHYSICAL_GOLD');
      const otherAssets = assets.filter(a => a.type !== 'PHYSICAL_GOLD');

      if (goldAssets.length > 0) {
        setProgress(`更新黄金价格 (${goldAssets.length}个)...`);
        const goldUpdatedCount = await updateBatchGoldPrices(goldAssets.map(a => a.id));
        updatedCount += goldUpdatedCount;
      }

      // 2. Process other assets in batches
      const batchSize = 3;
      for (let i = 0; i < otherAssets.length; i += batchSize) {
        const batch = otherAssets.slice(i, i + batchSize);
        // Adjust progress display to account for already processed gold assets
        const currentProgress = goldAssets.length + Math.min(i + batchSize, otherAssets.length);
        setProgress(`更新中 ${currentProgress}/${total}`);
        
        const results = await Promise.all(batch.map(asset => updateSingleAssetPrice(asset.id)));
        updatedCount += results.filter(Boolean).length;
        
        if (i + batchSize < otherAssets.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      await revalidateAssets();
      
      setDialogData({
        title: "刷新成功",
        message: `成功更新 ${updatedCount} / ${total} 个资产的价格`,
      });
      setDialogOpen(true);
    } catch (error) {
      setDialogData({
        title: "刷新失败",
        message: "发生未知错误，请稍后重试",
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <>
      <Button 
        type="button"
        variant="outline" 
        onClick={handleRefresh} 
        disabled={loading}
        className="gap-2 min-w-[120px]"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {loading ? progress : "刷新行情"}
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogData.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogData.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
