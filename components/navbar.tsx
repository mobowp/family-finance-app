'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  PieChart, 
  ArrowRightLeft,
  Menu,
  Settings
} from "lucide-react";
import { Button } from "./ui/button";
import { NavbarUser } from "./navbar-user";

export function Navbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "首页",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/transactions",
      label: "记账",
      icon: ArrowRightLeft,
      active: pathname.startsWith("/transactions"),
    },
    {
      href: "/wealth",
      label: "财富",
      icon: Wallet,
      active: pathname.startsWith("/wealth") || pathname.startsWith("/accounts") || pathname.startsWith("/assets"),
    },
    {
      href: "/settings",
      label: "设置",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
              家庭理财
            </span>
          </Link>
          
          <div className="hidden md:flex gap-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all hover:bg-accent hover:text-accent-foreground",
                  route.active 
                    ? "bg-accent text-accent-foreground shadow-sm" 
                    : "text-muted-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="md:hidden">
             <Menu className="h-5 w-5" />
           </Button>
           <NavbarUser />
        </div>
      </div>
      
      {/* Mobile Nav - Simple Bottom Bar for ease of access */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-2 md:hidden grid grid-cols-5 gap-1 pb-safe">
         {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors",
                route.active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
      </div>
    </nav>
  );
}
