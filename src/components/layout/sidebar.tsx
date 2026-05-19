"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PhoneCall, 
  Users, 
  Bot, 
  Megaphone, 
  CreditCard, 
  Settings, 
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calls", href: "/calls", icon: PhoneCall },
  { name: "Agents", href: "/agents", icon: Bot },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { profile } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-full">
      <div className="p-6 flex items-center gap-2">
        <PhoneCall className="w-6 h-6 text-primary" />
        <span className="font-serif text-2xl tracking-tight text-sidebar-foreground">Callify</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <span className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}>
                <Icon className="w-4 h-4" />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        {profile && (
          <div className="mb-4 px-3 py-2 bg-sidebar-accent rounded-md flex items-center justify-between">
            <span className="text-sm font-medium">Credits</span>
            <span className="text-sm font-bold">{profile.credits_remaining}</span>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
