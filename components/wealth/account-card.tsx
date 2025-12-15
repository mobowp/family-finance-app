'use client';

import Link from "next/link";
import { CreditCard, Wallet, Landmark, Edit2, User, TrendingUp, PiggyBank, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface AccountCardProps {
  account: any;
  formatCurrency: (value: number) => string;
}

export function AccountCard({ account, formatCurrency }: AccountCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalBalance = account.balance + (account.children?.reduce((sum: number, child: any) => sum + child.balance, 0) || 0);

  const getAccountIcon = (account: any) => {
    if (account.icon) {
        return (
            <Avatar className="h-5 w-5">
                <AvatarImage src={account.icon} />
                <AvatarFallback>{account.name[0]}</AvatarFallback>
            </Avatar>
        )
    }

    switch (account.type) {
      case 'CASH': return <Wallet className="h-5 w-5" />;
      case 'SAVINGS': return <PiggyBank className="h-5 w-5" />;
      case 'INVESTMENT': return <TrendingUp className="h-5 w-5" />;
      case 'DEBT': return <CreditCard className="h-5 w-5" />;
      default: return <Landmark className="h-5 w-5" />;
    }
  };

  const getAccountGradient = (type: string) => {
    switch (type) {
      case 'CASH': return "bg-gradient-to-br from-emerald-400 to-emerald-600";
      case 'SAVINGS': return "bg-gradient-to-br from-blue-500 to-blue-700";
      case 'INVESTMENT': return "bg-gradient-to-br from-violet-500 to-purple-700";
      case 'DEBT': return "bg-gradient-to-br from-red-500 to-orange-600";
      default: return "bg-gradient-to-br from-slate-600 to-slate-800";
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'INVESTMENT': return '投资';
      case 'SAVINGS': return '存储';
      case 'CASH': return '现金';
      case 'DEBT': return '负债';
      default: return type;
    }
  };

  const hasChildren = account.children && account.children.length > 0;

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl text-white shadow-xl transition-all hover:shadow-2xl group ${getAccountGradient(account.type)}`}
    >
      {/* Background Decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-black/10 blur-2xl pointer-events-none" />
      
      {/* Edit Icon */}
      <Link 
        href={`/accounts/${account.id}/edit`} 
        className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
          <div className="bg-black/20 p-2 rounded-full hover:bg-black/40">
              <Edit2 className="h-4 w-4 text-white" />
          </div>
      </Link>
      
      <div className="relative flex flex-col h-full p-6">
        <Link href={`/accounts/${account.id}/edit`} className="block flex-1">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg tracking-wide">{account.name}</h2>
              <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full w-fit">
                {getAccountIcon(account)}
                <span>{getAccountTypeName(account.type)}</span>
              </div>
            </div>
          </div>

          {account.user && (
            <div className="mt-2 flex items-center gap-1 text-xs text-white/60">
              <User className="h-3 w-3" />
              <span>{account.user.name || account.user.email}</span>
            </div>
          )}

          <div className="mt-4 space-y-1">
            <div>
              <div className="text-xs text-white/60 mb-0.5">总余额</div>
              <div className="text-2xl font-bold font-mono tracking-tight flex items-baseline gap-2">
                {formatCurrency(totalBalance)}
                <span className="text-xs text-white/60 font-normal">{account.currency}</span>
              </div>
            </div>
            {hasChildren && (
              <div className="flex gap-4 text-xs text-white/80">
                <div>
                  <span className="opacity-60">主账户: </span>
                  <span className="font-mono">{formatCurrency(account.balance)}</span>
                </div>
                <div>
                  <span className="opacity-60">子账户: </span>
                  <span className="font-mono">
                    {formatCurrency(account.children.reduce((sum: number, child: any) => sum + child.balance, 0))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Sub Accounts Display - Collapsible */}
        {hasChildren && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center justify-between w-full text-xs text-white/60 hover:text-white/90 transition-colors"
            >
              <span>子账户 ({account.children.length})</span>
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {isExpanded && (
              <div className="space-y-1 mt-2 animate-in slide-in-from-top-2 duration-200">
                  {account.children.map((child: any) => (
                    <div key={child.id} className="flex justify-between text-sm hover:bg-white/10 p-1 rounded transition-colors">
                        <span className="text-white/80">{child.name}</span>
                        <span className="font-mono">{formatCurrency(child.balance)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
