'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DataBackup() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      setIsExporting(true);
          
  const response = await fetch('/api/backup/export');
      if (!response.ok) {
        throw new Error('导出失败');
      }
      
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `family-finance-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: '导出成功',
        description: '数据已成功导出到文件'
      });
    } catch (error) {
      toast({
        title: '导出失败',
     description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      
      const text = await file.text();
      const response = await fetch('/api/backup/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: text
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '导入失败');
      }
      
      toast({
        title: '导入成功',
        description: '数据已成功导入，页面将刷新'
      });   
   
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast({
        title: '导入失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>数据备份与恢复</CardTitle>
        <CardDescription>
          导出所有数据到文件，或从备份文件恢复数据
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                导出中...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                导出所有数据
              </>
            )}
          </Button>
          
          <div className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
  className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file" className="w-full">
              <Button
                type="button"
                variant="outline"
                disabled={isImporting}
                className="w-full"
                onClick={() => document.getElementById('import-file')?.click()}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    导入中...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    导入备份数据
                  </>
                )}
              </Button>
            </label>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• 导出功能会将所有交易记录、账户、资产、分类、归物等数据保存为 JSON 文件</p>
          <p>• 导入功能会从备份文件恢复数据，适用于新账户配置或数据迁移</p>
          <p>• 建议定期备份数据以防数据丢失</p>
        </div>
      </CardContent>
    </Card>
  );
}
